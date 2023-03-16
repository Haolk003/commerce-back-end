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
const mongoose_1 = __importDefault(require("mongoose")); // Erase if already required
const crypto_js_1 = __importDefault(require("crypto-js"));
// Declare the Schema of the Mongo model
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: [Object],
        default: [],
    },
    address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Address",
    },
    wishList: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "wishlist",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        default: "a",
    },
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = crypto_js_1.default.AES.encrypt(`${this.password}`, `${process.env.CRYPTO_KEY}`).toString();
    });
});
//Export the model
userSchema.method("isPasswordMatched", function isPasswordMatched(enterPassword) {
    const hashedPassword = crypto_js_1.default.AES.decrypt(`${this.password}`, `${process.env.CRYPTO_KEY}`).toString(crypto_js_1.default.enc.Utf8);
    if (enterPassword === hashedPassword) {
        return true;
    }
    else {
        return false;
    }
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=auth.js.map