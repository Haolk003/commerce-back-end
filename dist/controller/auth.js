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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAdmin = exports.resetPassword = exports.forgotPassword = exports.updatePassword = exports.logout = exports.hanleRefreshToken = exports.login = exports.register = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../models/auth"));
const jwt_token_1 = require("../config/jwt.token");
const refreshToken_1 = require("../config/refreshToken");
const errorHandle_1 = require("../middlewares/errorHandle");
const validateId_1 = require("../utils/validateId");
const emailCtrl_1 = require("./emailCtrl");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = req.body;
    try {
        const findUser = yield auth_1.default.findOne({ email: email });
        if (!findUser) {
            const newUser = yield auth_1.default.create({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
            });
            res.status(200).json(newUser);
        }
        else {
            throw new Error("User Already Exists");
        }
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password: passwordLogin } = req.body;
        const findUser = yield auth_1.default.findOne({ email });
        if (!findUser) {
            throw (0, errorHandle_1.createError)(403, "User not found");
        }
        if (!findUser.isPasswordMatched(passwordLogin)) {
            throw (0, errorHandle_1.createError)(403, "Password is not matched");
        }
        const refreshToken = yield (0, refreshToken_1.generateRefreshToken)({
            id: findUser._id,
            isAdmin: findUser.isAdmin,
        });
        const updateRefreshToken = yield auth_1.default.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken,
        }, { new: true }).populate("wishList");
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
        });
        // res.cookie("hello", "heh");
        const _a = updateRefreshToken._doc, { password } = _a, details = __rest(_a, ["password"]);
        res.status(200).json(Object.assign(Object.assign({}, details), { token: yield (0, jwt_token_1.generateToken)({
                id: findUser._id,
                isAdmin: findUser.isAdmin,
            }), expiryTime: Date.now() + 15 * 60 * 1000 }));
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const LoginAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password: passwordLogin } = req.body;
        const findAdmin = yield auth_1.default.findOne({ email, isAdmin: true });
        if (!findAdmin) {
            throw (0, errorHandle_1.createError)(404, "Not Admin");
        }
        if (!findAdmin.isPasswordMatched(passwordLogin)) {
            throw (0, errorHandle_1.createError)(401, "Password is not matched");
        }
        const refreshTokens = yield (0, refreshToken_1.generateRefreshToken)({
            id: findAdmin._id,
            isAdmin: findAdmin.isAdmin,
        });
        const updateRefreshToken = yield auth_1.default.findByIdAndUpdate(findAdmin._id, {
            refreshToken: refreshTokens,
        }, { new: true });
        res.cookie("refreshToken", refreshTokens, {
            httpOnly: true,
            // maxAge: 72 * 60 * 60 * 1000,
        });
        const _b = updateRefreshToken._doc, { password, address, cart, isAdmin, refreshToken, wishList, isBlocked } = _b, details = __rest(_b, ["password", "address", "cart", "isAdmin", "refreshToken", "wishList", "isBlocked"]);
        res.status(200).json(Object.assign(Object.assign({}, details), { token: yield (0, jwt_token_1.generateToken)({
                id: findAdmin._id,
                isAdmin: findAdmin.isAdmin,
            }), expiryTime: Date.now() + 15 * 60 * 1000 }));
    }
    catch (err) {
        next(err);
    }
});
exports.LoginAdmin = LoginAdmin;
const hanleRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies.refreshToken;
        console.log(req.cookies);
        console.log(cookies);
        if (!cookies) {
            console.log("no");
            throw (0, errorHandle_1.createError)(500, "No Refresh Token in Cookie");
        }
        const findUser = yield auth_1.default.findOne({ refreshToken: cookies });
        if (!findUser)
            throw (0, errorHandle_1.createError)(500, "No refreshToken present in db or not matched");
        const user = jsonwebtoken_1.default.verify(`${cookies}`, `${process.env.JWT_KEY}`);
        if (!user) {
            throw (0, errorHandle_1.createError)(500, "There is something wrong with refresh token");
        }
        else {
            console.log(user);
            const token = yield (0, jwt_token_1.generateToken)({
                id: findUser._id,
                isAdmin: findUser.isAdmin,
            });
            if (token) {
                res.status(200).json({
                    token: token,
                    expiryTime: Date.now() + 60 * 1000,
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.hanleRefreshToken = hanleRefreshToken;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.status(204).json("logouted");
    }
    catch (err) {
        next(err);
    }
});
exports.logout = logout;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { password } = req.body;
    (0, validateId_1.validateMongoDbId)(id);
    try {
        let user = yield auth_1.default.findById(id);
        if (password) {
            user.password = password;
            const updatePasswords = yield user.save();
            res.json(updatePasswords);
        }
    }
    catch (err) {
        next(err);
    }
});
exports.updatePassword = updatePassword;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield auth_1.default.findOne({ email });
        if (!user) {
            throw (0, errorHandle_1.createError)(404, "User not found with this email");
        }
        const token = yield user.createPasswordResetToken();
        yield user.save();
        const resetURL = `Hi,Please follow this link to reset Your password. This link is valid till 10 minute from now.<a href='${process.env.FRONTEND_URL}/reset-password/${token}'>Click</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL,
        };
        (0, emailCtrl_1.sendEmail)(data);
        res.status(200).send(token);
    }
    catch (err) {
        next(err);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const { token } = req.params;
    try {
        const compareToken = crypto_js_1.default.SHA256(token);
        let findUser = yield auth_1.default.findOne({
            passwordResetToken: compareToken.toString(),
            passwordResetExpires: { $gte: Date.now() },
        });
        if (!findUser) {
            throw (0, errorHandle_1.createError)(500, "Reset Password is Failure");
        }
        findUser.password = password;
        findUser.passwordResetExpires = undefined;
        findUser.passwordResetToken = undefined;
        yield findUser.save();
        res.status(200).json(findUser);
    }
    catch (err) {
        next(err);
    }
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.js.map