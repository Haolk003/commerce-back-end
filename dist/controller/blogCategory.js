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
exports.deleteCategory = exports.getCategory = exports.getAllCategory = exports.updateCategory = exports.createCategory = void 0;
const blogCategory_1 = __importDefault(require("../models/blogCategory"));
const validateId_1 = require("../utils/validateId");
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategory = yield blogCategory_1.default.create(req.body);
        res.status(200).json(newCategory);
    }
    catch (err) {
        next(err);
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const category = yield blogCategory_1.default.findByIdAndUpdate(id, req.body);
        res.status(200).json(category);
    }
    catch (err) {
        next(err);
    }
});
exports.updateCategory = updateCategory;
const getAllCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield blogCategory_1.default.find();
        res.status(200).json(category);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllCategory = getAllCategory;
const getCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const category = yield blogCategory_1.default.findById(id);
        res.status(200).json(category);
    }
    catch (err) {
        next(err);
    }
});
exports.getCategory = getCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        yield blogCategory_1.default.findByIdAndDelete(id);
        res.status(200).json("deleted");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=blogCategory.js.map