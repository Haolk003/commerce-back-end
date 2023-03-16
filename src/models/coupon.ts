import mongoose from "mongoose";
interface ICoupon {
  name: string;
  startDate: Date;
  endDate: Date;
  discount: number;
  code: string;
}
const CouponSchema = new mongoose.Schema<ICoupon>({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  startDate: {
    type: Date,

    default: Date.now(),
  },
  endDate: {
    type: Date,
  },
  discount: {
    type: Number,
    required: true,
  },
});
export default mongoose.model("Coupon", CouponSchema);
