import { Request, Response, NextFunction } from "express";
import Category from "../models/productCategory";
import { validateMongoDbId } from "../utils/validateId";
const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err: any) {
    next(err);
  }
};
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (err: any) {
    next(err);
  }
};
interface QueryParams {
  title?: string;
}
const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.query as QueryParams;
  try {
    let category;
    if (title !== "" && title) {
      category = await Category.find({
        title: { $regex: title, $options: "i" },
      });
    } else {
      category = await Category.find();
    }

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};
const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (err: any) {
    next(err);
  }
};
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json("deleted");
  } catch (err: any) {
    next(err);
  }
};

export {
  createCategory,
  updateCategory,
  getAllCategory,
  getCategory,
  deleteCategory,
};
