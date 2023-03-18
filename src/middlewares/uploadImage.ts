import sharp from "sharp";
import multer from "multer";
import { Express, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename(req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});
const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: Function
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});
interface File {
  path: string;
  filename: string;
}
declare module "express-serve-static-core" {
  interface Request {
    files: [];
  }
}

const productImgResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file: File) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`dist/public/images/products/${file.filename}`);
      fs.unlinkSync(`dist/public/images/${file.filename}`);
      return (file.path = `dist/public/images/products/${file.filename}`);
    })
  );
  console.log(req.files);
  next();
};
const blogImgResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next();
  await Promise.all(
    req?.files?.map(async (file: File) => {
      await sharp(file?.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`dist/public/images/blogs/${file.filename}`);
      fs.unlinkSync(`dist/public/images/${file.filename}`);
      return (file.path = `E:\\coder\\Ecommerce-app\\api\\dist\\public\\images\\blogs\\${file.filename}`);
    })
  );
  next();
};
export { uploadPhoto, productImgResize, blogImgResize };
