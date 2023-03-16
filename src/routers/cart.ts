import { userCart, getCart, emptyCart, applyCoupon } from "../controller/cart";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleWare";
const router = express.Router();
router.post("/addCart", authMiddleware, userCart);
router.get("/getCart", authMiddleware, getCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.put("/applyCoupon", authMiddleware, applyCoupon);
export default router;
