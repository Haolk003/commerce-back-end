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
exports.deleteBrand = exports.getBrand = exports.getAllBrand = exports.updateBrand = exports.createBrand = void 0;
const brand_1 = __importDefault(require("../models/brand"));
const validateId_1 = require("../utils/validateId");
const createBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBrand = yield brand_1.default.create(req.body);
        res.status(200).json(newBrand);
    }
    catch (err) {
        next(err);
    }
});
exports.createBrand = createBrand;
const updateBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const brand = yield brand_1.default.findByIdAndUpdate(id, req.body);
        res.status(200).json(brand);
    }
    catch (err) {
        next(err);
    }
});
exports.updateBrand = updateBrand;
const getAllBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brand = yield brand_1.default.find();
        res.status(200).json(brand);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllBrand = getAllBrand;
const getBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const brand = yield brand_1.default.findById(id);
        res.status(200).json(brand);
    }
    catch (err) {
        next(err);
    }
});
exports.getBrand = getBrand;
const deleteBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        yield brand_1.default.findByIdAndDelete(id);
        res.status(200).json("deleted");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteBrand = deleteBrand;
//# sourceMappingURL=brand.js.map