"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.get("/getsAll", user_1.getAllUSer);
router.get("/getUser/:id", user_1.getUser);
router.delete("/deleteUser/:id", authMiddleWare_1.checkIsAdmin, user_1.deleteUser);
router.put("/updateUser", authMiddleWare_1.authMiddleware, user_1.updateUser);
router.put("/blockUser/:id", authMiddleWare_1.checkIsAdmin, user_1.blockUser);
router.put("/unBlockUser/:id", authMiddleWare_1.checkIsAdmin, user_1.unBlockUser);
router.get("/getWishList/:id", authMiddleWare_1.authMiddleware, user_1.getWishlist);
router.put("/saveAddress/:id", authMiddleWare_1.authMiddleware, user_1.saveAddress);
router.put("/addWishlist", authMiddleWare_1.authMiddleware, user_1.addWishlist);
router.put("/removeWishlist", authMiddleWare_1.authMiddleware, user_1.removerWishlist);
exports.default = router;
//# sourceMappingURL=user.js.map