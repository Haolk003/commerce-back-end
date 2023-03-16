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
exports.checkIsAdmin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandle_1 = require("./errorHandle");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let token;
    try {
        if ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) {
            token = (_c = req.headers) === null || _c === void 0 ? void 0 : _c.authorization.split(" ")[1];
        }
        else {
            throw (0, errorHandle_1.createError)(401, "Not Authoried token expried,Please login again");
        }
        if (token) {
            jsonwebtoken_1.default.verify(token, `${process.env.JWT_KEY}`, (err, user) => {
                if (err) {
                    throw next(err);
                }
                req.user = user;
                next();
            });
        }
        else {
            throw (0, errorHandle_1.createError)(401, "Not Authoried token expried,Please login again");
        }
    }
    catch (err) {
        next(err);
    }
});
exports.authMiddleware = authMiddleware;
const checkIsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        authMiddleware(req, res, (err) => {
            var _a;
            if (err) {
                return next(err);
            }
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                return (0, errorHandle_1.createError)(401, "You are not Admin");
            }
            else {
                next();
            }
        });
    }
    catch (err) {
        next(err);
    }
});
exports.checkIsAdmin = checkIsAdmin;
//# sourceMappingURL=authMiddleWare.js.map