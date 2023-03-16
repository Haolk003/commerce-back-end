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
            price: Number,
        },
    ],
    cartTotal: { type: Number, default: 0 },
    totalAfterDiscount: Number,
    orderBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Cart", OrderSchema);
//# sourceMappingURL=cart.js.map