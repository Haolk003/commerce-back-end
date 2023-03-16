import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../controller/productCategory";
import { checkIsAdmin } from "../middlewares/authMiddleWare";
const router = express.Router();
router.post("/create", checkIsAdmin, createCategory);
router.get("/get/:id", getCategory);
router.get("/getAll", getAllCategory);
router.put("/update/:id", checkIsAdmin, updateCategory);
router.delete("/delete/:id", checkIsAdmin, deleteCategory);
export default router;
