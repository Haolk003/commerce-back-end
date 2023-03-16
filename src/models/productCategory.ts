import mongoose from "mongoose";
interface ICategory {
  title: string;
  image: string;
  isPublish: boolean;
}
const CategorySchema = new mongoose.Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    isPublish: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("PCategory", CategorySchema);
