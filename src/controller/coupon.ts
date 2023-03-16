import Coupon from "../models/coupon";
import { Response, Request, NextFunction } from "express";
import { validateMongoDbId } from "../utils/validateId";
import { createError } from "../middlewares/errorHandle";
const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(200).json(newCoupon);
  } catch (err) {
    next(err);
  }
};
const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    console.log(req.body);
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCoupon);
  } catch (err) {
    next(err);
  }
};
const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    await Coupon.findByIdAndDelete(id);
    res.status(200).json("Deleted");
  } catch (err) {
    next(err);
  }
};
const getAllCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search } = req.query;
  try {
    let coupons;
    if (search !== "" && search) {
      coupons = await Coupon.find({
        $or: [
          { code: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      coupons = await Coupon.find();
    }
    res.status(200).json(coupons);
  } catch (err) {
    next(err);
  }
};
const getCoupon = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const coupon = await Coupon.findById(id);
    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};
const checkCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await Coupon.findOne({ code: req.body.code });
    if (!coupon) {
      throw createError(400, "Can not find Coupon");
    }
    res.status(200).json(coupon);
  } catch (err) {
    next(err);
  }
};
export {
  createCoupon,
  updateCoupon,
  getCoupon,
  deleteCoupon,
  getAllCoupon,
  checkCoupon,
};
