"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_1 = require("../controller/cart");
const express_1 = __importDefault(require("express"));
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/addCart", authMiddleWare_1.authMiddleware, cart_1.userCart);
router.get("/getCart", authMiddleWare_1.authMiddleware, cart_1.getCart);
router.delete("/empty-cart", authMiddleWare_1.authMiddleware, cart_1.emptyCart);
router.put("/applyCoupon", authMiddleWare_1.authMiddleware, cart_1.applyCoupon);
exports.default = router;
//# sourceMappingURL=cart.js.map