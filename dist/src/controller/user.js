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
exports.unBlockUser = exports.blockUser = exports.getUser = exports.deleteUser = exports.updateUser = exports.getAllUSer = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const validateId_1 = require("../../utils/validateId");
//get all users
const getAllUSer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUsers = yield auth_1.default.find();
        res.status(200).json(getUsers);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUSer = getAllUSer;
//get a user
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const getUser = yield auth_1.default.findById(id);
        res.status(200).json(getUser);
    }
    catch (err) {
        next(err);
    }
});
exports.getUser = getUser;
//delete user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const getUser = yield auth_1.default.findByIdAndDelete(id);
        res.status(200).json("successfully deleted");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
//update User
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const getUser = yield auth_1.default.findByIdAndUpdate(id, req.body);
        res.status(200).json(getUser);
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
//Block User
const blockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const blockUser = yield auth_1.default.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.status(200).json(blockUser);
    }
    catch (err) {
        next(err);
    }
});
exports.blockUser = blockUser;
const unBlockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const unBlockUser = yield auth_1.default.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.status(200).json(unBlockUser);
    }
    catch (err) {
        next(err);
    }
});
exports.unBlockUser = unBlockUser;
//# sourceMappingURL=user.js.map