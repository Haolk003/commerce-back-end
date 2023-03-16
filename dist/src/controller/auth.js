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
exports.login = exports.register = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const jwt_token_1 = require("../config/jwt.token");
const refreshToken_1 = require("../config/refreshToken");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const findUser = yield auth_1.default.findOne({ email: email });
        if (!findUser) {
            const newUser = yield auth_1.default.create(req.body);
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
            throw new Error("User not found");
        }
        if (!findUser.isPasswordMatched(passwordLogin)) {
            throw new Error("Password is not matched");
        }
        const refreshToken = yield (0, refreshToken_1.generateRefreshToken)({
            id: findUser._id,
            isAdmin: findUser.isAdmin,
        });
        const updateRefreshToken = yield auth_1.default.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken,
        }, { new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        console.log("a");
        const _a = updateRefreshToken._doc, { password } = _a, details = __rest(_a, ["password"]);
        res.status(200).send(Object.assign(Object.assign({}, details), { token: yield (0, jwt_token_1.generateToken)({
                id: findUser._id,
                isAdmin: findUser.isAdmin,
            }) }));
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
//# sourceMappingURL=auth.js.map