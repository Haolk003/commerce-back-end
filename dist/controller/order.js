"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalWeekly = exports.aggOrder = exports.classifyOrder = exports.getAllOrder = exports.updateOrderStatus = exports.getOrders = exports.createOrder = void 0;
const order_1 = __importDefault(require("../models/order"));
const cart_1 = __importDefault(require("../models/cart"));
const auth_1 = __importDefault(require("../models/auth"));
const product_1 = __importDefault(require("../models/product"));
const coupon_1 = __importDefault(require("../models/coupon"));
const validateId_1 = require("../utils/validateId");
const errorHandle_1 = require("../middlewares/errorHandle");
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
const stripe_1 = __importDefault(require("stripe"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const stripe = new stripe_1.default("sk_test_51M0SbXFVVOtfRhpqCwhJmJLRJw8z167og4PDelLhVAp96UArkX2AKIOJKHGVF9loT5xD1Wg7YLqINTHrn4wKHkmJ00DtDRkfJH", {
    apiVersion: "2022-11-15",
});
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { COD, tripeId, couponApplied, phoneNumber, address } = req.body;
    console.log(req.body);
    (0, validateId_1.validateMongoDbId)(id);
    try {
        if (!COD)
            throw (0, errorHandle_1.createError)(500, "Create cash order failed");
        const user = yield auth_1.default.findById(id);
        let userCart = yield cart_1.default.findOne({ orderBy: id });
        if (!userCart) {
            throw (0, errorHandle_1.createError)(500, "err");
        }
        else {
            let finalAmount = userCart.cartTotal + 5;
            if (couponApplied) {
                const findCoupon = yield coupon_1.default.findOne({ code: couponApplied });
                if (findCoupon) {
                    finalAmount = Number((userCart === null || userCart === void 0 ? void 0 : userCart.cartTotal) -
                        (userCart.cartTotal * findCoupon.discount) / 100);
                }
                else {
                    finalAmount = userCart.cartTotal;
                }
            }
            else {
                finalAmount = userCart.cartTotal;
            }
            const payment = yield stripe.paymentIntents.create({
                amount: Math.floor(finalAmount * 100),
                currency: "USD",
                description: "Spatula company",
                payment_method: tripeId,
                confirm: true,
            });
            const newOrder = yield order_1.default.create({
                products: userCart.products,
                paymentIntent: {
                    id: (0, uuid_1.v4)(),
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
            let update = userCart.products.map((item) => {
                return {
                    updateOne: {
                        filter: { _id: item.product._id },
                        update: { $inc: { quantity: -item.count, sold: item.count } },
                    },
                };
            });
            const updated = yield product_1.default.bulkWrite(update, {});
            yield userCart.remove();
            res.status(200).json({ newOrder });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    (0, validateId_1.validateMongoDbId)(orderId);
    try {
        const findOrder = yield order_1.default.findOne({
            _id: orderId,
        })
            .populate("products.product")
            .populate("orderBy");
        res.status(200).json(findOrder);
    }
    catch (err) {
        next(err);
    }
});
exports.getOrders = getOrders;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { orderId } = req.params;
    (0, validateId_1.validateMongoDbId)(orderId);
    const { status } = req.body;
    (0, validateId_1.validateMongoDbId)(id);
    console.log(status);
    try {
        const updateOrder = yield order_1.default.findOneAndUpdate({ _id: orderId }, { orderStatus: status, $set: { "paymentIntent.status": status } }, { new: true });
        res.status(200).json(updateOrder);
    }
    catch (err) {
        next(err);
    }
});
exports.updateOrderStatus = updateOrderStatus;
const aggOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderDay = yield order_1.default.aggregate([
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
        const orderMonth = yield order_1.default.aggregate([
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
        const orderAll = yield order_1.default.aggregate([
            {
                $match: { orderStatus: { $exists: true } },
            },
            {
                $group: {
                    _id: null,
                    sum_price: { $sum: "$paymentIntent.amount" },
                },
            },
            {
                $project: {
                    sum_price: 1,
                    _id: 1,
                },
            },
        ]).exec();
        res.status(200).json({ orderDay, orderMonth, orderAll });
    }
    catch (err) {
        next(err);
    }
});
exports.aggOrder = aggOrder;
const classifyOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classifyOrder = yield order_1.default.aggregate([
            { $match: { orderStatus: { $exists: true } } },
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
            { $project: { _id: 0, orderStatus: "$_id", count: 1 } },
        ]);
        res.status(200).json(classifyOrder);
    }
    catch (err) {
        next(err);
    }
});
exports.classifyOrder = classifyOrder;
const getAllOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = req.query;
        console.log(phone);
        const queryObj = Object.assign({}, req.query);
        const excludeField = ["page", "sort", "limit", "fields", "phone"];
        excludeField.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        console.log(queryStr);
        let query;
        if (phone !== "" && phone) {
            const objectSign = Object.assign({ phone: { $regex: phone, $options: "i" } }, JSON.parse(queryStr));
            query = order_1.default.find(objectSign);
            console.log(phone);
        }
        else {
            query = order_1.default.find(JSON.parse(queryStr));
        }
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }
        else {
            query = query.sort("-createdAt");
        }
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }
        else {
            query = query.select("-__v");
        }
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const skip = (Number(page) - 1) * limit;
        query = query.skip(skip).limit(limit);
        const orders = yield query;
        const orderCount = yield order_1.default.countDocuments();
        res.status(200).json({ orders, orderCount });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllOrder = getAllOrder;
const totalWeekly = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startOfWeek = (0, dayjs_1.default)().subtract(1, "week").startOf("week").toDate();
        const endOfWeek = (0, dayjs_1.default)().subtract(1, "week").endOf("week").toDate();
        const aggregate = yield order_1.default.aggregate([
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
        dayjs_1.default.extend(relativeTime_1.default);
        let data = [];
        for (let i = 0; i < 7; i++) {
            const find = aggregate.find((item) => (0, dayjs_1.default)(item._id).date() === (0, dayjs_1.default)(startOfWeek).add(i, "day").date());
            data.push({
                date: (0, dayjs_1.default)(startOfWeek).add(i, "day").format("YYYY-MM-DD"),
                totalSale: find ? find === null || find === void 0 ? void 0 : find.totalSale : 0,
                totalOrder: find ? find.totalOrder : 0,
            });
        }
        res.status(200).json(data);
    }
    catch (err) {
        next(err);
    }
});
exports.totalWeekly = totalWeekly;
//# sourceMappingURL=order.js.map