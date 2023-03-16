"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    tags: [
        {
            type: String,
        },
    ],
    category: [
        {
            type: String,
        },
    ],
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: [
        {
            type: String,
        },
    ],
    color: [
        {
            type: String,
        },
    ],
    ratings: [
        {
            star: { type: Number, min: 0, max: 5 },
            postedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String },
            time: { type: Date, default: Date.now() },
        },
    ],
    totalRating: {
        type: Number,
        default: 0,
    },
    sale: {
        startDate: { type: Date },
        endDate: { type: Date },
        discount: { type: Number },
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=product.js.map