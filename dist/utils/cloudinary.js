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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryDeleteImg = exports.cloudinaryUploadImg = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: `dmvhjd3e5`,
    api_key: "478684633832122",
    api_secret: "TxCBXbjIf5vVBtIkU7hfHWEpbp4",
    background_removal: 1,
    background_color: "white",
});
const cloudinaryUploadImg = (fileToUploads) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(fileToUploads);
        return result.url;
    }
    catch (err) {
        console.log(err);
    }
    //   });
});
exports.cloudinaryUploadImg = cloudinaryUploadImg;
const cloudinaryDeleteImg = (fileToDelete) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cloudinary_1.v2.uploader.destroy(fileToDelete);
    return result;
});
exports.cloudinaryDeleteImg = cloudinaryDeleteImg;
//# sourceMappingURL=cloudinary.js.map