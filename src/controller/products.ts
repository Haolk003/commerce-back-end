import slugify from "slugify";
import fs from "fs";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import { createError } from "../middlewares/errorHandle";
import { validateMongoDbId } from "../utils/validateId";
import { cloudinaryUploadImg } from "../utils/cloudinary";
import User from "../models/auth";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req?.body?.title && !req?.body?.slug) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.status(200).json(newProduct);
  } catch (err) {
    next(err);
  }
};
const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const product = await Product.findById(id).populate({
      path: "ratings.postedBy",
      select: "firstName lastName email",
    });
    res.status(200).json(product);
  } catch (err: any) {
    next(err);
  }
};

interface QueryRequest {
  sort: string;
  fields: string;
  limit: number;
  page: number;
}
interface QueryParams {
  title?: string;
}
const getAllProduct = async (
  req: Request<{}, {}, {}, QueryRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.query as QueryParams;
    const queryObj = { ...req.query };

    const excludeField = ["page", "sort", "limit", "fields", "title"];
    excludeField.forEach((el) => delete queryObj[el as keyof QueryRequest]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match: any) => `$${match}`
    );

    let query;

    if (title !== "" && title) {
      const objectSign = Object.assign(
        { title: { $regex: title, $options: "i" } },
        JSON.parse(queryStr)
      );
      query = Product.find(objectSign);
      console.log(title);
    } else {
      query = Product.find(JSON.parse(queryStr));
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (Number(page) - 1) * limit;
    query = query.skip(skip).limit(limit);

    const productCount = await Product.countDocuments();
    console.log(productCount);
    // if (skip >= productCount) {
    //   throw createError(500, "This Page does not exist");
    // }

    const product = await query;

    res.status(200).json({ products: product, productCount: productCount });
  } catch (err: any) {
    next(err);
  }
};
const getAllProductPublic = async (
  req: Request<{}, {}, {}, QueryRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.query as QueryParams;
    const queryObj = { ...req.query };

    const excludeField = ["page", "sort", "limit", "fields", "title"];
    excludeField.forEach((el) => delete queryObj[el as keyof QueryRequest]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match: any) => `$${match}`
    );

    let query;

    if (title !== "" && title) {
      const objectSign = Object.assign(
        { title: { $regex: title, $options: "i" } },
        { isPublic: true }
      );
      query = Product.find(objectSign);
    } else if (queryStr) {
      query = Product.find(
        Object.assign(JSON.parse(queryStr), { isPublic: true })
      );
    } else {
      query = Product.find();
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (Number(page) - 1) * limit;
    query = query.skip(skip).limit(limit);

    const productCount = await Product.countDocuments();
    console.log(productCount);
    if (skip >= productCount) {
      throw createError(500, "This Page does not exist");
    }

    const product = await query;
    console.log(product);
    res.status(200).json({ products: product, productCount: productCount });
  } catch (err: any) {
    next(err);
  }
};
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json("deleted");
  } catch (err: any) {
    next(err);
  }
};
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProducts = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateProducts);
  } catch (err: any) {
    next(err);
  }
};
interface userRequest extends Request {
  user: {
    id: string;
    isAdmin: boolean;
  };
}

const rating = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  validateMongoDbId(id);
  const { star, proId, comment } = req.body;

  validateMongoDbId(proId);
  try {
    if (star < 0 || star > 5) {
      throw createError(400, "Vui long nhap star lon hon 0 va be hon 5");
    }
    const product = await Product.findById(proId);
    if (!product) {
      throw createError(400, "can't find product");
    }

    const alreadyRate = product.ratings.find(
      (rating) => rating?.postedBy.toString() === id.toString()
    );
    if (alreadyRate) {
      const updateRating = await Product.updateOne(
        { ratings: { $elemMatch: alreadyRate } },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
            "ratings.$.time": Date.now(),
          },
        },
        { new: true }
      );
      console.log(updateRating);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        proId,
        { $push: { ratings: { star: star, postedBy: id, comment: comment } } },
        { new: true }
      );
    }
    const getAllRating = await Product.findById(proId);
    const ratingLength = getAllRating?.ratings.length || 0;
    const sumRating =
      getAllRating?.ratings.reduce((total, num) => {
        return total + num?.star;
      }, 0) || 0;
    const updateProduct = await Product.findByIdAndUpdate(
      proId,
      {
        totalRating: (sumRating / ratingLength).toFixed(1),
      },
      { new: true }
    ).populate("ratings.postedBy");
    res.status(200).json(updateProduct);
  } catch (err) {
    next(err);
  }
};
const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const urls = [];
    const files: any = req.files;

    for (const file of files) {
      const { path } = file;

      const newPath = await cloudinaryUploadImg(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    next(err);
  }
};
export {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  rating,
  uploadImages,
  getAllProductPublic,
};
