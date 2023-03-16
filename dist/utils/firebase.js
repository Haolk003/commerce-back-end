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
exports.uploadImage = exports.storage = void 0;
const app_1 = require("@firebase/app");
const storage_1 = require("@firebase/storage");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "ecommerce-app2-937f4.firebaseapp.com",
    projectId: "ecommerce-app2-937f4",
    storageBucket: "ecommerce-app2-937f4.appspot.com",
    messagingSenderId: "1012544638619",
    appId: "1:1012544638619:web:b17e3b2e31f897a2af003e",
    measurementId: "G-H5634SPNZ3",
};
const app = (0, app_1.initializeApp)(firebaseConfig);
const storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
const uploadImage = ({ path, file }) => __awaiter(void 0, void 0, void 0, function* () {
    const storageRef = (0, storage_1.ref)(storage, path);
    const metadata = {
        contentType: "image/jpeg",
    };
    yield (0, storage_1.uploadBytes)(storageRef, file, metadata);
});
exports.uploadImage = uploadImage;
//# sourceMappingURL=firebase.js.map