import mongoose from "mongoose";
const DbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(`${process.env.MONGOOSE_KEY}`);
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
  }
};
export default DbConnect;
