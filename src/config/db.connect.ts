import mongoose, { ConnectOptions } from "mongoose";
const DbConnect = async () => {
  const options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      `mongodb+srv://haolk003:01653186782az@cluster0.ayevk90.mongodb.net/ecommerce-app?retryWrites=true&w=majority`
    );
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
  }
};
export default DbConnect;
