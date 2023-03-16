import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  rating,
  uploadImages,
  getAllProductPublic,
} from "../controller/products";

import { uploadPhoto, productImgResize } from "../middlewares/uploadImage";
import { authMiddleware, checkIsAdmin } from "../middlewares/authMiddleWare";
const router = express.Router();
router.post("/create", checkIsAdmin, createProduct);
router.put("/update/:id", checkIsAdmin, updateProduct);
router.get("/getProduct/:id", getProduct);
router.get("/getAll", checkIsAdmin, getAllProduct);
router.delete("/delete/:id", checkIsAdmin, deleteProduct);
router.put("/rating", authMiddleware, rating);
router.get("/getAllPublic", getAllProductPublic);
router.put(
  "/upload/:id",
  checkIsAdmin,
  uploadPhoto?.array("images", 10),
  productImgResize,
  uploadImages
);

export default router;
