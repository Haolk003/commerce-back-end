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
exports.uploadImages = exports.dislikeBlog = exports.likeBlog = exports.deleteBlog = exports.getAllBlog = exports.getBlog = exports.updateBlog = exports.createBlog = void 0;
const fs_1 = __importDefault(require("fs"));
const blog_1 = __importDefault(require("../models/blog"));
const validateId_1 = require("../utils/validateId");
const errorHandle_1 = require("../middlewares/errorHandle");
const cloudinary_1 = require("../utils/cloudinary");
const createBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createBlog = yield blog_1.default.create(req.body);
        res.status(200).json(createBlog);
    }
    catch (err) {
        next(err);
    }
});
exports.createBlog = createBlog;
const updateBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const updateBlog = yield blog_1.default.findByIdAndUpdate(id, req.body);
        res.status(200).json(updateBlog);
    }
    catch (err) {
        next(err);
    }
});
exports.updateBlog = updateBlog;
const getBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        const updateViews = yield blog_1.default.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true })
            .populate("likes")
            .populate("dislikes");
        res.status(200).json(updateViews);
    }
    catch (err) {
        next(err);
    }
});
exports.getBlog = getBlog;
const getAllBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blog_1.default.find();
        res.status(200).json(blogs);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllBlog = getAllBlog;
const deleteBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        yield blog_1.default.findByIdAndDelete(id);
        res.send(200).json("deleted");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteBlog = deleteBlog;
const likeBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { blogId } = req.params;
    (0, validateId_1.validateMongoDbId)(blogId);
    try {
        const blog = yield blog_1.default.findById(blogId);
        if (!blog) {
            throw (0, errorHandle_1.createError)(400, "Can not find blog");
        }
        const loginUserId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        const isDisliked = blog.dislikes.find((userId) => userId.toString() === loginUserId.toString());
        const alreadylike = (_b = blog === null || blog === void 0 ? void 0 : blog.likes) === null || _b === void 0 ? void 0 : _b.find((userId) => userId.toString() === loginUserId.toString());
        if (isDisliked) {
            const updateBlog = yield blog_1.default.findByIdAndUpdate(blogId, { $pull: { dislikes: loginUserId }, isDisliked: false }, { new: true });
        }
        if (alreadylike) {
            const updateBlog = yield blog_1.default.findByIdAndUpdate(blogId, { $pull: { likes: loginUserId }, isLiked: false }, { new: true });
            res.status(200).json(updateBlog);
        }
        else {
            const updateBlog = yield blog_1.default.findByIdAndUpdate(blogId, { $push: { likes: loginUserId }, isLiked: true }, { new: true });
            res.status(200).json(updateBlog);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.likeBlog = likeBlog;
const dislikeBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { blogId } = req.params;
    (0, validateId_1.validateMongoDbId)(blogId);
    try {
        const blog = yield blog_1.default.findById(blogId);
        if (!blog) {
            throw (0, errorHandle_1.createError)(400, "Can not find blog");
        }
        const loginUserId = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id;
        const isLiked = blog.isLiked;
        const alreadydislike = (_d = blog === null || blog === void 0 ? void 0 : blog.dislikes) === null || _d === void 0 ? void 0 : _d.find((userId) => userId.toString() === loginUserId.toString());
        if (isLiked) {
            const updateBlog = yield blog_1.default.findByIdAndUpdate(blogId, { $pull: { likes: loginUserId }, isLiked: false }, { new: true });
        }
        if (alreadydislike) {
            const updateBlog = yield blog_1.default.findByIdAndUpdate(blogId, { $pull: { dislikes: loginUserId }, isDisliked: false }, { new: true });
            res.status(200).json(updateBlog);
        }
        else {
            const updateBlog = yield blog_1.default.findByIdAndUpdate(blogId, { $push: { dislikes: loginUserId }, isDisliked: true }, { new: true });
            res.status(200).json(updateBlog);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.dislikeBlog = dislikeBlog;
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
        const updateBlog = yield blog_1.default.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            }),
        }, { new: true });
        res.status(200).json(updateBlog);
    }
    catch (err) {
        next(err);
    }
});
exports.uploadImages = uploadImages;
//# sourceMappingURL=blog.js.map