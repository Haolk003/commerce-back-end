import mongoose, { Types } from "mongoose";
import { createError } from "../middlewares/errorHandle";
const validateMongoDbId = (id: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) return createError(500, "This id is not valid or not Found");
};
export { validateMongoDbId };
