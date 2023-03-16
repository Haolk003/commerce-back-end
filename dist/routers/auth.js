"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/register", auth_1.register);
router.put("/login", auth_1.login);
router.get("/refreshToken", auth_1.hanleRefreshToken);
router.put("/logout", auth_1.logout);
router.put("/updatePassword", authMiddleWare_1.authMiddleware, auth_1.updatePassword);
router.post("/forgot-password", auth_1.forgotPassword);
router.put("/reset-password/:token", auth_1.resetPassword);
router.post("/admin-login", auth_1.LoginAdmin);
exports.default = router;
//# sourceMappingURL=auth.js.map