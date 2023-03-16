"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogCategory_1 = require("../controller/blogCategory");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/create", authMiddleWare_1.checkIsAdmin, blogCategory_1.createCategory);
router.get("/get/:id", blogCategory_1.getCategory);
router.get("/getAll", blogCategory_1.getAllCategory);
router.put("/update/:id", authMiddleWare_1.checkIsAdmin, blogCategory_1.updateCategory);
router.delete("/delete/:id", authMiddleWare_1.checkIsAdmin, blogCategory_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=blog-categories.js.map