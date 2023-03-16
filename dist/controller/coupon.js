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
exports.checkCoupon = exports.getAllCoupon = exports.deleteCoupon = exports.getCoupon = exports.updateCoupon = exports.createCoupon = void 0;
const coupon_1 = __importDefault(require("../models/coupon"));
const validateId_1 = require("../utils/validateId");
const errorHandle_1 = require("../middlewares/errorHandle");
const createCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCoupon = yield coupon_1.default.create(req.body);
        res.status(200).json(newCoupon);
    }
    catch (err) {
        next(err);
    }
});
exports.createCoupon = createCoupon;
const updateCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        console.log(req.body);
        const updatedCoupon = yield coupon_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatedCoupon);
    }
    catch (err) {
        next(err);
    }
});
exports.updateCoupon = updateCoupon;
const deleteCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        yield coupon_1.default.findByIdAndDelete(id);
        res.status(200).json("Deleted");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCoupon = deleteCoupon;
const getAllCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    try {
        let coupons;
        if (search !== "" && search) {
            coupons = yield coupon_1.default.find({
                $or: [
                    { code: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } },
                ],
            });
        }
        else {
            coupons = yield coupon_1.default.find();
        }
        res.status(200).json(coupons);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllCoupon = getAllCoupon;
const getCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const coupon = yield coupon_1.default.findById(id);
        res.status(200).json(coupon);
    }
    catch (err) {
        next(err);
    }
});
exports.getCoupon = getCoupon;
const checkCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield coupon_1.default.findOne({ code: req.body.code });
        if (!coupon) {
            throw (0, errorHandle_1.createError)(400, "Can not find Coupon");
        }
        res.status(200).json(coupon);
    }
    catch (err) {
        next(err);
    }
});
exports.checkCoupon = checkCoupon;
//# sourceMappingURL=coupon.js.map