import mongoose, { ConnectOptions } from "mongoose";
const DbConnect = async () => {
  const options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(`mongodb://127.0.0.1:27017/commerce`);
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
  }
};
export default DbConnect;
