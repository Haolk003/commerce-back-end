"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: [{ type: String, required: true }],
    numViews: { type: Number, default: 0 },
    dislikes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    images: [{ type: String }],
    author: {
        type: String,
        default: "admin",
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
});
exports.default = mongoose_1.default.model("blog", blogSchema);
//# sourceMappingURL=blog.js.map