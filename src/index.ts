import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import DbConnect from "./config/db.connect";
import authRouter from "./routers/auth";
import userRouter from "./routers/user";

import productRouter from "./routers/products";
import productCategoryRouter from "./routers/product-category";

import CouponRouter from "./routers/coupon";

import cartRouter from "./routers/cart";
import orderRouter from "./routers/order";

import uploadRouter from "./routers/upload";
import { handleError } from "./middlewares/errorHandle";
dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`, `${process.env.ADMIN_URL}`],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
DbConnect();
const port = process.env.PORT || 5000;
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/product-categories", productCategoryRouter);
app.use("/api/coupons", CouponRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

app.use(handleError);
app.listen(port, () => {
  console.log(`Sever running at PORT ${process.env.PORT}`);
});
