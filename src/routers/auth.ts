import express from "express";
import {
  register,
  login,
  hanleRefreshToken,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  LoginAdmin,
} from "../controller/auth";
import { authMiddleware, checkIsAdmin } from "../middlewares/authMiddleWare";
const router = express.Router();
router.post("/register", register);
router.put("/login", login);
router.get("/refreshToken", hanleRefreshToken);
router.put("/logout", logout);
router.put("/updatePassword", authMiddleware, updatePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/admin-login", LoginAdmin);
export default router;
