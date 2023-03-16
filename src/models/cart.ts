import mongoose, { Types } from "mongoose";
interface MongoResult {
  _doc: any;
}
interface Product {
  product: Types.ObjectId;
  count: number;
  price: number;
}
interface ICard extends MongoResult {
  products: Product[];
  paymentIntent: {};

  orderBy: Types.ObjectId;
  cartTotal: number;
  totalAfterDiscount: number;
}
const OrderSchema = new mongoose.Schema<ICard>(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        count: Number,
        price: Number,
      },
    ],
    cartTotal: { type: Number, default: 0 },
    totalAfterDiscount: Number,

    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", OrderSchema);
