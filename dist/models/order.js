"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    products: [
        {
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" },
            count: Number,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Processing", "Cancel", "Delivered"],
    },
    orderBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", OrderSchema);
//# sourceMappingURL=order.js.map