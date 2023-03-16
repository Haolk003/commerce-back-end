import user from "../models/auth";
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { createError } from "./errorHandle";
declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: string;
      isAdmin: boolean;
    };
  }
}
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  try {
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers?.authorization.split(" ")[1];
    } else {
      throw createError(401, "Not Authoried token expried,Please login again");
    }
    if (token) {
      jwt.verify(token, `${process.env.JWT_KEY}`, (err: any, user: any) => {
        if (err) {
          throw next(err);
        }
        req.user = user;
        next();
      });
    } else {
      throw createError(401, "Not Authoried token expried,Please login again");
    }
  } catch (err: any) {
    next(err);
  }
};

const checkIsAdmin = async (req: any, res: any, next: any) => {
  try {
    authMiddleware(req, res, (err: any) => {
      if (err) {
        return next(err);
      }
      if (!req.user?.isAdmin) {
        return createError(401, "You are not Admin");
      } else {
        next();
      }
    });
  } catch (err: any) {
    next(err);
  }
};
export { authMiddleware, checkIsAdmin };
