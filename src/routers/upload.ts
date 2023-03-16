import { deleteImages, uploadImages } from "../controller/uploadImg";
import express from "express";
import { uploadPhoto, productImgResize } from "../middlewares/uploadImage";
import { checkIsAdmin, authMiddleware } from "../middlewares/authMiddleWare";
const router = express.Router();
router.post(
  "/",
  authMiddleware,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.delete("/delete/:id", checkIsAdmin, deleteImages);
export default router;
