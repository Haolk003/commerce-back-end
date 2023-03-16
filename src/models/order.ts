import mongoose, { Types } from "mongoose";
interface Product {
  product: Types.ObjectId;
  count: number;
  color: string;
}
interface IOder {
  products: Product[];
  paymentIntent: {};
  orderStatus: string;
  orderBy: Types.ObjectId;
  address: string;
  phone: string;
}
const OrderSchema = new mongoose.Schema<IOder>(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        count: Number,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Cancel", "Delivered"],
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Order", OrderSchema);
