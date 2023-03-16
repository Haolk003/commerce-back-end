import mongoose, { Date, Types } from "mongoose";
import { Schema } from "yup";
interface Ratings {
  star: number;
  postedBy: Types.ObjectId;
  comment: string;
  time: Date;
}
interface Sale {
  startDate: Date | null;
  endDate: Date | null;
  discount: number;
}
interface IProduct {
  title: string;
  slug: string;
  description: string;
  price: number;
  category: [string];
  quantity: number;
  images: string[];
  color: string[];
  ratings: Ratings[];
  brand: string;
  sold: number;
  totalRating: number;
  tags: string[];
  sale: Sale;
  isPublic: boolean;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    category: [
      {
        type: String,
      },
    ],

    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    color: [
      {
        type: String,
      },
    ],
    ratings: [
      {
        star: { type: Number, min: 0, max: 5 },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        time: { type: Date, default: Date.now() },
      },
    ],
    totalRating: {
      type: Number,
      default: 0,
    },
    sale: {
      startDate: { type: Date },
      endDate: { type: Date },
      discount: { type: Number },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Product", productSchema);
