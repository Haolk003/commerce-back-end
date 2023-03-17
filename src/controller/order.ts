import Order from "../models/order";
import Cart from "../models/cart";
import User from "../models/auth";
import Product from "../models/product";
import Coupon from "../models/coupon";

import { Response, Request, NextFunction } from "express";
import { validateMongoDbId } from "../utils/validateId";
import { createError } from "../middlewares/errorHandle";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import dayjs from "dayjs";
import Stripe from "stripe";
import relativeTime from "dayjs/plugin/relativeTime";
const stripe = new Stripe(
  "sk_test_51M0SbXFVVOtfRhpqCwhJmJLRJw8z167og4PDelLhVAp96UArkX2AKIOJKHGVF9loT5xD1Wg7YLqINTHrn4wKHkmJ00DtDRkfJH",
  {
    apiVersion: "2022-11-15",
  }
);
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const { COD, tripeId, couponApplied, phoneNumber, address } = req.body;
  console.log(req.body);
  validateMongoDbId(id);
  try {
    if (!COD) throw createError(500, "Create cash order failed");
    const user = await User.findById(id);
    let userCart = await Cart.findOne({ orderBy: id });
    if (!userCart) {
      throw createError(500, "err");
    } else {
      let finalAmount = userCart.cartTotal + 5;
      if (couponApplied) {
        const findCoupon = await Coupon.findOne({ code: couponApplied });
        if (findCoupon) {
          finalAmount = Number(
            userCart?.cartTotal -
              (userCart.cartTotal * findCoupon.discount) / 100
          );
        } else {
          finalAmount = userCart.cartTotal;
        }
      } else {
        finalAmount = userCart.cartTotal;
      }
      const payment = await stripe.paymentIntents.create({
        amount: Math.floor(finalAmount * 100),
        currency: "USD",
        description: "Spatula company",
        payment_method: tripeId,
        confirm: true,
      });

      const newOrder = await Order.create({
        products: userCart.products,
        paymentIntent: {
          id: uuidv4(),
          method: "COD",
          amount: finalAmount,
          status: "Pending",
          created: Date.now(),
          currency: "usd",
        },
        orderBy: id,
        orderStatus: "Pending",
        phone: phoneNumber,
        address: address,
      });
      let update = userCart.products.map((item: any) => {
        return {
          updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.count, sold: item.count } },
          },
        };
      });
      const updated = await Product.bulkWrite(update, {});
      await userCart.remove();
      res.status(200).json({ newOrder });
    }
  } catch (err) {
    next(err);
  }
};
interface QueryParams {
  phone?: string;
}
interface QueryRequest {
  sort: string;
  fields: string;
  limit: number;
  page: number;
}
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  validateMongoDbId(orderId);

  try {
    const findOrder = await Order.findOne({
      _id: orderId,
    })
      .populate("products.product")
      .populate("orderBy");
    res.status(200).json(findOrder);
  } catch (err) {
    next(err);
  }
};
const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  const { orderId } = req.params;
  validateMongoDbId(orderId);
  const { status } = req.body;
  validateMongoDbId(id);
  console.log(status);
  try {
    const updateOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { orderStatus: status, $set: { "paymentIntent.status": status } },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (err) {
    next(err);
  }
};
const aggOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderDay = await Order.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              { $dateToString: { format: "%Y-%m-%d", date: new Date() } },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          total_orders: { $sum: 1 },
          sum_price: { $sum: "$paymentIntent.amount" },
        },
      },
      {
        $project: {
          _id: 1,
          total_orders: 1,
          sum_price: 1,
        },
      },
    ]).exec();
    const orderMonth = await Order.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              { $dateToString: { format: "%Y-%m", date: new Date() } },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
            },
          },
          total_orders: { $sum: 1 },
          sum_price: { $sum: "$paymentIntent.amount" },
        },
      },
      {
        $project: {
          _id: 1,
          total_orders: 1,
          sum_price: 1,
        },
      },
    ]).exec();
    const orderAll = await Order.aggregate([
      {
        $match: { orderStatus: { $exists: true } },
      },
      {
        $group: {
          sum_price: { $sum: "$paymentIntent.amount" },
        },
      },
      {
        $project: {
          total_orders: 1,
        },
      },
    ]).exec();
    res.status(200).json({ orderDay, orderMonth, orderAll });
  } catch (err) {
    next(err);
  }
};
const classifyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const classifyOrder = await Order.aggregate([
      { $match: { orderStatus: { $exists: true } } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      { $project: { _id: 0, orderStatus: "$_id", count: 1 } },
    ]);
    res.status(200).json(classifyOrder);
  } catch (err) {
    next(err);
  }
};
const getAllOrder = async (
  req: Request<{}, {}, {}, QueryRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone } = req.query as QueryParams;
    console.log(phone);
    const queryObj = { ...req.query };

    const excludeField = ["page", "sort", "limit", "fields", "phone"];
    excludeField.forEach((el) => delete queryObj[el as keyof QueryRequest]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match: any) => `$${match}`
    );
    console.log(queryStr);
    let query;

    if (phone !== "" && phone) {
      const objectSign = Object.assign(
        { phone: { $regex: phone, $options: "i" } },
        JSON.parse(queryStr)
      );
      query = Order.find(objectSign);
      console.log(phone);
    } else {
      query = Order.find(JSON.parse(queryStr));
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (Number(page) - 1) * limit;
    query = query.skip(skip).limit(limit);
    const orders = await query;
    const orderCount = await Order.countDocuments();
    res.status(200).json({ orders, orderCount });
  } catch (err) {
    next(err);
  }
};
const totalWeekly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startOfWeek = dayjs().subtract(1, "week").startOf("week").toDate();
    const endOfWeek = dayjs().subtract(1, "week").endOf("week").toDate();

    const aggregate = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSale: { $sum: "$paymentIntent.amount" },
          totalOrder: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          totalSale: 1,
          totalOrder: 1,
        },
      },
    ]).exec();

    dayjs.extend(relativeTime);
    let data = [];
    for (let i = 0; i < 7; i++) {
      const find = aggregate.find(
        (item) =>
          dayjs(item._id).date() === dayjs(startOfWeek).add(i, "day").date()
      );
      data.push({
        date: dayjs(startOfWeek).add(i, "day").format("YYYY-MM-DD"),
        totalSale: find ? find?.totalSale : 0,
        totalOrder: find ? find.totalOrder : 0,
      });
    }
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export {
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrder,
  classifyOrder,
  aggOrder,
  totalWeekly,
};
