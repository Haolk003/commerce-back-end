import { Response, Request, NextFunction } from "express";
import Cart from "../models/cart";
import User from "../models/auth";
import Coupon from "../models/coupon";
import Product from "../models/product";
import { validateMongoDbId } from "../utils/validateId";
import { createError } from "../middlewares/errorHandle";

const userCart = async (req: Request, res: Response, next: NextFunction) => {
  const cart = req.body;
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    let Products = [];
    const user = await User.findById(id);
    if (!user) {
      throw createError(400, "User not found");
    }
    const alreadyExistsCart = await Cart.findOneAndRemove({ orderBy: id });

    for (let i = 0; i < cart.length; i++) {
      const object: any = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      let getPrice = await Product.findById(cart[i].id);
      if (getPrice) {
        object.price =
          getPrice.price - (getPrice.price * getPrice.sale.discount) / 100;
        Products.push(object);
      }
    }

    let cartTotal = Products.reduce((total, num) => {
      return total + num.count * num.price;
    }, 0).toFixed(2);
    const newCart = await Cart.create({
      products: Products,
      cartTotal: cartTotal,
      orderBy: id,
    });

    res.status(200).json(newCart);
  } catch (err) {
    next(err);
  }
};
const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  console.log(id);
  validateMongoDbId(id);
  try {
    const cart = await Cart.findOne({ orderBy: id }).populate(
      "products.product"
    );
    console.log(cart);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};
const emptyCart = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    await Cart.findOneAndRemove({ orderBy: id });
    res.status(200).json("removed successfully");
  } catch (err) {
    next(err);
  }
};
const applyCoupon = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const { coupon } = req.body;
  validateMongoDbId(id);
  try {
    const findCoupon = await Coupon.findOne({ name: coupon });
    if (!findCoupon) {
      throw createError(500, "invalid coupon");
    }
    const cart: any = await Cart.findOne({
      orderBy: id,
    });
    if (!cart) {
      res.status(200).json(null);
    } else {
      const totalDiscount = (
        cart.cartTotal -
        (cart.cartTotal * findCoupon.discount) / 100
      ).toFixed(2);
      const updateCart = await Cart.findOneAndUpdate(
        { orderBy: id },
        { totalAfterDiscount: totalDiscount },
        { new: true }
      );

      res.status(200).json(updateCart);
    }
  } catch (err) {
    next(err);
  }
};
export { userCart, getCart, emptyCart, applyCoupon };
