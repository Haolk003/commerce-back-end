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
exports.deleteColor = exports.getColor = exports.getAllColor = exports.updateColor = exports.createColor = void 0;
const color_1 = __importDefault(require("../models/color"));
const validateId_1 = require("../utils/validateId");
const createColor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newColor = yield color_1.default.create(req.body);
        res.status(200).json(newColor);
    }
    catch (err) {
        next(err);
    }
});
exports.createColor = createColor;
const updateColor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const color = yield color_1.default.findByIdAndUpdate(id, req.body);
        res.status(200).json(color);
    }
    catch (err) {
        next(err);
    }
});
exports.updateColor = updateColor;
const getAllColor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const color = yield color_1.default.find();
        res.status(200).json(color);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllColor = getAllColor;
const getColor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const color = yield color_1.default.findById(id);
        res.status(200).json(color);
    }
    catch (err) {
        next(err);
    }
});
exports.getColor = getColor;
const deleteColor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        yield color_1.default.findByIdAndDelete(id);
        res.status(200).json("deleted");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteColor = deleteColor;
//# sourceMappingURL=color.js.map