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
exports.applyCoupon = exports.emptyCart = exports.getCart = exports.userCart = void 0;
const cart_1 = __importDefault(require("../models/cart"));
const auth_1 = __importDefault(require("../models/auth"));
const coupon_1 = __importDefault(require("../models/coupon"));
const product_1 = __importDefault(require("../models/product"));
const validateId_1 = require("../utils/validateId");
const errorHandle_1 = require("../middlewares/errorHandle");
const userCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = req.body;
    const { id } = req.user;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        let Products = [];
        const user = yield auth_1.default.findById(id);
        if (!user) {
            throw (0, errorHandle_1.createError)(400, "User not found");
        }
        const alreadyExistsCart = yield cart_1.default.findOneAndRemove({ orderBy: id });
        for (let i = 0; i < cart.length; i++) {
            const object = {};
            object.product = cart[i].id;
            object.count = cart[i].count;
            let getPrice = yield product_1.default.findById(cart[i].id);
            if (getPrice) {
                object.price =
                    getPrice.price - (getPrice.price * getPrice.sale.discount) / 100;
                Products.push(object);
            }
        }
        let cartTotal = Products.reduce((total, num) => {
            return total + num.count * num.price;
        }, 0).toFixed(2);
        const newCart = yield cart_1.default.create({
            products: Products,
            cartTotal: cartTotal,
            orderBy: id,
        });
        res.status(200).json(newCart);
    }
    catch (err) {
        next(err);
    }
});
exports.userCart = userCart;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    console.log(id);
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const cart = yield cart_1.default.findOne({ orderBy: id }).populate("products.product");
        console.log(cart);
        res.status(200).json(cart);
    }
    catch (err) {
        next(err);
    }
});
exports.getCart = getCart;
const emptyCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        yield cart_1.default.findOneAndRemove({ orderBy: id });
        res.status(200).json("removed successfully");
    }
    catch (err) {
        next(err);
    }
});
exports.emptyCart = emptyCart;
const applyCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { coupon } = req.body;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const findCoupon = yield coupon_1.default.findOne({ name: coupon });
        if (!findCoupon) {
            throw (0, errorHandle_1.createError)(500, "invalid coupon");
        }
        const cart = yield cart_1.default.findOne({
            orderBy: id,
        });
        if (!cart) {
            res.status(200).json(null);
        }
        else {
            const totalDiscount = (cart.cartTotal -
                (cart.cartTotal * findCoupon.discount) / 100).toFixed(2);
            const updateCart = yield cart_1.default.findOneAndUpdate({ orderBy: id }, { totalAfterDiscount: totalDiscount }, { new: true });
            res.status(200).json(updateCart);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.applyCoupon = applyCoupon;
//# sourceMappingURL=cart.js.map