import express from "express";
import {
  getAllUSer,
  deleteUser,
  getUser,
  updateUser,
  blockUser,
  unBlockUser,
  getWishlist,
  saveAddress,
  addWishlist,
  removerWishlist,
} from "../controller/user";
import { authMiddleware, checkIsAdmin } from "../middlewares/authMiddleWare";
const router = express.Router();
router.get("/getsAll", getAllUSer);
router.get("/getUser/:id", getUser);
router.delete("/deleteUser/:id", checkIsAdmin, deleteUser);
router.put("/updateUser", authMiddleware, updateUser);
router.put("/blockUser/:id", checkIsAdmin, blockUser);
router.put("/unBlockUser/:id", checkIsAdmin, unBlockUser);
router.get("/getWishList/:id", authMiddleware, getWishlist);
router.put("/saveAddress/:id", authMiddleware, saveAddress);
router.put("/addWishlist", authMiddleware, addWishlist);
router.put("/removeWishlist", authMiddleware, removerWishlist);
export default router;
