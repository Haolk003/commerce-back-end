"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CouponSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now(),
    },
    endDate: {
        type: Date,
    },
    discount: {
        type: Number,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Coupon", CouponSchema);
//# sourceMappingURL=coupon.js.map