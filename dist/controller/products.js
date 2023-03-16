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
exports.getAllProductPublic = exports.uploadImages = exports.rating = exports.updateProduct = exports.getProduct = exports.getAllProduct = exports.deleteProduct = exports.createProduct = void 0;
const slugify_1 = __importDefault(require("slugify"));
const fs_1 = __importDefault(require("fs"));
const product_1 = __importDefault(require("../models/product"));
const errorHandle_1 = require("../middlewares/errorHandle");
const validateId_1 = require("../utils/validateId");
const cloudinary_1 = require("../utils/cloudinary");
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.title) && !((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.slug)) {
            req.body.slug = (0, slugify_1.default)(req.body.title);
        }
        const newProduct = yield product_1.default.create(req.body);
        res.status(200).json(newProduct);
    }
    catch (err) {
        next(err);
    }
});
exports.createProduct = createProduct;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const product = yield product_1.default.findById(id).populate({
            path: "ratings.postedBy",
            select: "firstName lastName email",
        });
        res.status(200).json(product);
    }
    catch (err) {
        next(err);
    }
});
exports.getProduct = getProduct;
const getAllProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.query;
        const queryObj = Object.assign({}, req.query);
        const excludeField = ["page", "sort", "limit", "fields", "title"];
        excludeField.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query;
        if (title !== "" && title) {
            const objectSign = Object.assign({ title: { $regex: title, $options: "i" } }, JSON.parse(queryStr));
            query = product_1.default.find(objectSign);
            console.log(title);
        }
        else {
            query = product_1.default.find(JSON.parse(queryStr));
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
        const productCount = yield product_1.default.countDocuments();
        console.log(productCount);
        // if (skip >= productCount) {
        //   throw createError(500, "This Page does not exist");
        // }
        const product = yield query;
        res.status(200).json({ products: product, productCount: productCount });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllProduct = getAllProduct;
const getAllProductPublic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.query;
        const queryObj = Object.assign({}, req.query);
        const excludeField = ["page", "sort", "limit", "fields", "title"];
        excludeField.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query;
        if (title !== "" && title) {
            const objectSign = Object.assign({ title: { $regex: title, $options: "i" } }, JSON.parse(queryStr), { isPublic: true });
            query = product_1.default.find(objectSign);
            console.log(title);
        }
        else {
            query = product_1.default.find(Object.assign(JSON.parse(queryStr), { isPublic: true }));
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
        const productCount = yield product_1.default.countDocuments();
        console.log(productCount);
        if (skip >= productCount) {
            throw (0, errorHandle_1.createError)(500, "This Page does not exist");
        }
        const product = yield query;
        res.status(200).json({ products: product, productCount: productCount });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllProductPublic = getAllProductPublic;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        yield product_1.default.findByIdAndDelete(id);
        res.status(200).json("deleted");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteProduct = deleteProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        if (req.body.title) {
            req.body.slug = (0, slugify_1.default)(req.body.title);
        }
        const updateProducts = yield product_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updateProducts);
    }
    catch (err) {
        next(err);
    }
});
exports.updateProduct = updateProduct;
const rating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    (0, validateId_1.validateMongoDbId)(id);
    const { star, proId, comment } = req.body;
    (0, validateId_1.validateMongoDbId)(proId);
    try {
        if (star < 0 || star > 5) {
            throw (0, errorHandle_1.createError)(400, "Vui long nhap star lon hon 0 va be hon 5");
        }
        const product = yield product_1.default.findById(proId);
        if (!product) {
            throw (0, errorHandle_1.createError)(400, "can't find product");
        }
        const alreadyRate = product.ratings.find((rating) => (rating === null || rating === void 0 ? void 0 : rating.postedBy.toString()) === id.toString());
        if (alreadyRate) {
            const updateRating = yield product_1.default.updateOne({ ratings: { $elemMatch: alreadyRate } }, {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment,
                    "ratings.$.time": Date.now(),
                },
            }, { new: true });
            console.log(updateRating);
        }
        else {
            const rateProduct = yield product_1.default.findByIdAndUpdate(proId, { $push: { ratings: { star: star, postedBy: id, comment: comment } } }, { new: true });
        }
        const getAllRating = yield product_1.default.findById(proId);
        const ratingLength = (getAllRating === null || getAllRating === void 0 ? void 0 : getAllRating.ratings.length) || 0;
        const sumRating = (getAllRating === null || getAllRating === void 0 ? void 0 : getAllRating.ratings.reduce((total, num) => {
            return total + (num === null || num === void 0 ? void 0 : num.star);
        }, 0)) || 0;
        const updateProduct = yield product_1.default.findByIdAndUpdate(proId, {
            totalRating: (sumRating / ratingLength).toFixed(1),
        }, { new: true }).populate("ratings.postedBy");
        res.status(200).json(updateProduct);
    }
    catch (err) {
        next(err);
    }
});
exports.rating = rating;
const uploadImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = yield (0, cloudinary_1.cloudinaryUploadImg)(path);
            urls.push(newPath);
            fs_1.default.unlinkSync(path);
        }
        const updateProduct = yield product_1.default.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            }),
        }, { new: true });
        res.status(200).json(updateProduct);
    }
    catch (err) {
        next(err);
    }
});
exports.uploadImages = uploadImages;
//# sourceMappingURL=products.js.map