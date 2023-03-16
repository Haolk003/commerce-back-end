"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadImg_1 = require("../controller/uploadImg");
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../middlewares/uploadImage");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/", authMiddleWare_1.authMiddleware, uploadImage_1.uploadPhoto.array("images", 10), uploadImage_1.productImgResize, uploadImg_1.uploadImages);
router.delete("/delete/:id", authMiddleWare_1.checkIsAdmin, uploadImg_1.deleteImages);
exports.default = router;
//# sourceMappingURL=upload.js.map