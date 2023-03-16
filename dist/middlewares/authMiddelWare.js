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
exports.authMiddleware = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authMiddleware = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let token;
    if ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startWith("Bearer")) {
        token = (_c = req.headers) === null || _c === void 0 ? void 0 : _c.authorization.split(" ")[1];
    }
    try {
        if (token) {
            const decode = jsonwebtoken_1.default.verify(token, `${process.env.JWT_KEY}`);
            const checkUser = yield auth_1.default.findById(decode === null || decode === void 0 ? void 0 : decode.id);
            req.user = checkUser;
            next();
        }
        else {
            throw new Error("Not Authoried token expried,Please login again");
        }
    }
    catch (err) {
        throw new Error(err);
    }
}));
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddelWare.js.map