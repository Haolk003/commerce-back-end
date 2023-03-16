"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productCategory_1 = require("../controller/productCategory");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/create", authMiddleWare_1.checkIsAdmin, productCategory_1.createCategory);
router.get("/get/:id", productCategory_1.getCategory);
router.get("/getAll", productCategory_1.getAllCategory);
router.put("/update/:id", authMiddleWare_1.checkIsAdmin, productCategory_1.updateCategory);
router.delete("/delete/:id", authMiddleWare_1.checkIsAdmin, productCategory_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=product-category.js.map