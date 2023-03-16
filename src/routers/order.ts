import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrder,
  classifyOrder,
  aggOrder,
  totalWeekly,
} from "../controller/order";
import { authMiddleware, checkIsAdmin } from "../middlewares/authMiddleWare";
const router = express.Router();
router.post("/create", authMiddleware, createOrder);
router.get("/getOrder/:orderId", authMiddleware, getOrders);
router.put("/update/:orderId", checkIsAdmin, updateOrderStatus);
router.get("/getAll", checkIsAdmin, getAllOrder);
router.get("/classify", checkIsAdmin, classifyOrder);
router.get("/aggOrder", checkIsAdmin, aggOrder);
router.get("/totalWeekly", checkIsAdmin, totalWeekly);
export default router;
