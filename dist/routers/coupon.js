"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coupon_1 = require("../controller/coupon");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/create", authMiddleWare_1.checkIsAdmin, coupon_1.createCoupon);
router.put("/update/:id", authMiddleWare_1.checkIsAdmin, coupon_1.updateCoupon);
router.delete("/delete/:id", authMiddleWare_1.checkIsAdmin, coupon_1.deleteCoupon);
router.get("/getAll", coupon_1.getAllCoupon);
router.get("/get/:id", coupon_1.getCoupon);
router.put("/check", coupon_1.checkCoupon);
exports.default = router;
//# sourceMappingURL=coupon.js.map