"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_1 = require("../controller/blog");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const uploadImage_1 = require("../middlewares/uploadImage");
const router = express_1.default.Router();
router.post("/create", authMiddleWare_1.authMiddleware, blog_1.createBlog);
router.put("/update/:id", authMiddleWare_1.authMiddleware, blog_1.updateBlog);
router.get("/getBlog/:id", blog_1.getBlog);
router.get("/getAll", blog_1.getAllBlog);
router.delete("/delete", authMiddleWare_1.checkIsAdmin, blog_1.deleteBlog);
router.put("/like/:blogId", authMiddleWare_1.authMiddleware, blog_1.likeBlog);
router.put("/dislike/:blogId", authMiddleWare_1.authMiddleware, blog_1.dislikeBlog);
router.put("/upload/:id", authMiddleWare_1.checkIsAdmin, uploadImage_1.uploadPhoto === null || uploadImage_1.uploadPhoto === void 0 ? void 0 : uploadImage_1.uploadPhoto.array("images", 10), uploadImage_1.blogImgResize, blog_1.uploadImages);
exports.default = router;
//# sourceMappingURL=blog.js.map