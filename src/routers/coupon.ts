import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
  checkCoupon,
} from "../controller/coupon";
import { checkIsAdmin, authMiddleware } from "../middlewares/authMiddleWare";
const router = express.Router();
router.post("/create", checkIsAdmin, createCoupon);
router.put("/update/:id", checkIsAdmin, updateCoupon);
router.delete("/delete/:id", checkIsAdmin, deleteCoupon);
router.get("/getAll", getAllCoupon);
router.get("/get/:id", getCoupon);
router.put("/check", checkCoupon);
export default router;
