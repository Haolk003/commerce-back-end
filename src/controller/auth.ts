import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

import User from "../models/auth";
import { CookieSerializeOptions, serialize } from "cookie";
import { generateToken } from "../config/jwt.token";
import { generateRefreshToken } from "../config/refreshToken";
import { createError } from "../middlewares/errorHandle";

import { validateMongoDbId } from "../utils/validateId";
import { sendEmail } from "./emailCtrl";
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const newUser = await User.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      res.status(200).json(newUser);
    } else {
      throw new Error("User Already Exists");
    }
  } catch (err: any) {
    next(err);
  }
};
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password: passwordLogin } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) {
      throw createError(403, "User not found");
    }
    if (!findUser.isPasswordMatched(passwordLogin)) {
      throw createError(403, "Password is not matched");
    }
    const refreshToken = await generateRefreshToken({
      id: findUser._id,
      isAdmin: findUser.isAdmin,
    });
    const updateRefreshToken: any = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    ).populate("wishList");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    // res.cookie("hello", "heh");
    const { password, ...details } = updateRefreshToken._doc;
    res.status(200).json({
      ...details,
      token: await generateToken({
        id: findUser._id,
        isAdmin: findUser.isAdmin,
      }),
      expiryTime: Date.now() + 15 * 60 * 1000,
    });
  } catch (err: any) {
    next(err);
  }
};
const LoginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password: passwordLogin } = req.body;
    const findAdmin = await User.findOne({ email, isAdmin: true });
    if (!findAdmin) {
      throw createError(404, "Not Admin");
    }
    if (!findAdmin.isPasswordMatched(passwordLogin)) {
      throw createError(401, "Password is not matched");
    }

    const refreshTokens = await generateRefreshToken({
      id: findAdmin._id,
      isAdmin: findAdmin.isAdmin,
    });
    const updateRefreshToken: any = await User.findByIdAndUpdate(
      findAdmin._id,
      {
        refreshToken: refreshTokens,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshTokens, {
      httpOnly: true,
      // maxAge: 72 * 60 * 60 * 1000,
    });
    const {
      password,
      address,
      cart,
      isAdmin,
      refreshToken,
      wishList,
      isBlocked,
      ...details
    } = updateRefreshToken;

    res.status(200).json({
      ...details,
      token: await generateToken({
        id: findAdmin._id,
        isAdmin: findAdmin.isAdmin,
      }),
      expiryTime: Date.now() + 15 * 60 * 1000,
    });
  } catch (err) {
    next(err);
  }
};
const hanleRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies.refreshToken;
    console.log(req.cookies);
    console.log(cookies);
    if (!cookies) {
      console.log("no");
      throw createError(500, "No Refresh Token in Cookie");
    }

    const findUser = await User.findOne({ refreshToken: cookies });

    if (!findUser)
      throw createError(500, "No refreshToken present in db or not matched");
    const user = jwt.verify(`${cookies}`, `${process.env.JWT_KEY}`);
    if (!user) {
      throw createError(500, "There is something wrong with refresh token");
    } else {
      console.log(user);
      const token = await generateToken({
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
  } catch (err: any) {
    next(err);
  }
};
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(204).json("logouted");
  } catch (err: any) {
    next(err);
  }
};
const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongoDbId(id);
  try {
    let user: any = await User.findById(id);
    if (password) {
      user.password = password;
      const updatePasswords = await user.save();
      res.json(updatePasswords);
    }
  } catch (err: any) {
    next(err);
  }
};
const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found with this email");
    }
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi,Please follow this link to reset Your password. This link is valid till 10 minute from now.<a href='${process.env.FRONTEND_URL}/reset-password/${token}'>Click</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetURL,
    };
    sendEmail(data);
    res.status(200).send(token);
  } catch (err: any) {
    next(err);
  }
};
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const compareToken = CryptoJS.SHA256(token);

    let findUser = await User.findOne({
      passwordResetToken: compareToken.toString(),
      passwordResetExpires: { $gte: Date.now() },
    });

    if (!findUser) {
      throw createError(500, "Reset Password is Failure");
    }
    findUser.password = password;
    findUser.passwordResetExpires = undefined;
    findUser.passwordResetToken = undefined;
    await findUser.save();
    res.status(200).json(findUser);
  } catch (err: any) {
    next(err);
  }
};
export {
  register,
  login,
  hanleRefreshToken,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  LoginAdmin,
};
