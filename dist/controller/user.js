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
exports.removerWishlist = exports.saveAddress = exports.getWishlist = exports.unBlockUser = exports.blockUser = exports.addWishlist = exports.getUser = exports.deleteUser = exports.updateUser = exports.getAllUSer = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const errorHandle_1 = require("../middlewares/errorHandle");
const validateId_1 = require("../utils/validateId");
//get all users
const getAllUSer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    try {
        let getUsers;
        if (search && search !== "") {
            getUsers = yield auth_1.default.find({
                $or: [
                    { mobile: { $regex: search, $options: "i" } },
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            });
        }
        else {
            getUsers = yield auth_1.default.find();
        }
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
    var _a, _b, _c, _d, _e;
    const { id } = req.user;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const getUser = yield auth_1.default
            .findByIdAndUpdate(id, {
            firstName: (_a = req.body) === null || _a === void 0 ? void 0 : _a.firstName,
            lastName: (_b = req.body) === null || _b === void 0 ? void 0 : _b.lastName,
            address: (_c = req.body) === null || _c === void 0 ? void 0 : _c.address,
            image: (_d = req.body) === null || _d === void 0 ? void 0 : _d.image,
            mobile: (_e = req.body) === null || _e === void 0 ? void 0 : _e.mobile,
        }, { new: true })
            .populate("wishList");
        res.status(200).json(getUser);
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
//save address
const saveAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { address } = req.body;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const getUser = yield auth_1.default.findByIdAndUpdate(id, { address: address }, { new: true });
        res.status(200).json(getUser);
    }
    catch (err) {
        next(err);
    }
});
exports.saveAddress = saveAddress;
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
const getWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const findWishList = yield auth_1.default
            .findById(id, {
            firstName: 1,
            lastName: 1,
            email: 1,
            cart: 1,
            wishList: 1,
        })
            .populate({
            path: "wishList",
        });
        res.status(200).json(findWishList);
    }
    catch (err) {
        next(err);
    }
});
exports.getWishlist = getWishlist;
const addWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { proId } = req.body;
    (0, validateId_1.validateMongoDbId)(proId);
    try {
        const User = yield auth_1.default.findById(id);
        if (!User) {
            throw (0, errorHandle_1.createError)(400, "You are not authentication");
        }
        const alreadyadded = User.wishList.find((item) => item.toString() === proId.toString());
        if (alreadyadded) {
            let User = yield auth_1.default
                .findByIdAndUpdate(id, {
                $pull: { wishList: proId },
            }, { new: true })
                .populate("wishList");
            res.status(200).json(User);
        }
        else {
            let User = yield auth_1.default
                .findByIdAndUpdate(id, {
                $push: { wishList: proId },
            }, { new: true })
                .populate("wishList");
            res.status(200).json(User);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.addWishlist = addWishlist;
const removerWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { proId } = req.body;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const updateUser = yield auth_1.default
            .findByIdAndUpdate(id, { $pull: { wishList: proId } }, { new: true })
            .populate("wishList");
        res.status(200).json(updateUser);
    }
    catch (err) {
        next(err);
    }
});
exports.removerWishlist = removerWishlist;
//# sourceMappingURL=user.js.map