"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImages = exports.uploadImages = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../utils/cloudinary");
const uploadImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    console.log(files);
    try {
        const urls = [];
        for (const file of files) {
            const { path } = file;
            const newPath = yield (0, cloudinary_1.cloudinaryUploadImg)(path);
            urls.push(newPath);
            fs_1.default.unlinkSync(path);
        }
        const images = urls.map((file) => {
            return file;
        });
        res.status(200).json(images);
    }
    catch (err) {
        next(err);
    }
});
exports.uploadImages = uploadImages;
const deleteImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleted = (0, cloudinary_1.cloudinaryDeleteImg)(id);
        res.json({ message: "Deleted" });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteImages = deleteImages;
//# sourceMappingURL=uploadImg.js.map