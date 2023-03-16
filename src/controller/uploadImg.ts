import fs from "fs";
import { Response, Request, NextFunction } from "express";
import { cloudinaryDeleteImg, cloudinaryUploadImg } from "../utils/cloudinary";
const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files: any = req.files;
  console.log(files);
  try {
    const urls = [];
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinaryUploadImg(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.status(200).json(images);
  } catch (err) {
    next(err);
  }
};
const deleteImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
export { uploadImages, deleteImages };
