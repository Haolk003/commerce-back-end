"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = require("../controller/products");
const uploadImage_1 = require("../middlewares/uploadImage");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/create", authMiddleWare_1.checkIsAdmin, products_1.createProduct);
router.put("/update/:id", authMiddleWare_1.checkIsAdmin, products_1.updateProduct);
router.get("/getProduct/:id", products_1.getProduct);
router.get("/getAll", authMiddleWare_1.checkIsAdmin, products_1.getAllProduct);
router.delete("/delete/:id", authMiddleWare_1.checkIsAdmin, products_1.deleteProduct);
router.put("/rating", authMiddleWare_1.authMiddleware, products_1.rating);
router.get("/getAllPublic", products_1.getAllProductPublic);
router.put("/upload/:id", authMiddleWare_1.checkIsAdmin, uploadImage_1.uploadPhoto === null || uploadImage_1.uploadPhoto === void 0 ? void 0 : uploadImage_1.uploadPhoto.array("images", 10), uploadImage_1.productImgResize, products_1.uploadImages);
exports.default = router;
//# sourceMappingURL=products.js.map