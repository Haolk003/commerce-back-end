import mongoose, { Date, Model, Types } from "mongoose"; // Erase if already required
import CryptoJs, { SHA256 } from "crypto-js";
import randombytes from "randombytes";
interface MongoResult {
  _doc: any;
}
interface IUser extends MongoResult {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart: object[];
  mobile: string;
  address: String;
  wishList: Types.ObjectId[];
  isBlocked: boolean;
  refreshToken: string;
  passwordChangeAt: Date;
  passwordResetToken: String | undefined;
  passwordResetExpires: Date | undefined;
  image: string;
}
interface UserMethod {
  isPasswordMatched(enterPassword: string): boolean;
  createPasswordResetToken(): string;
}
type UserModel = Model<IUser, {}, UserMethod>;
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema<IUser, UserModel, UserMethod>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: [Object],
      default: [],
    },
    address: {
      type: String,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: Date,
    },
    image: {
      type: String,
      default:
        "https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-14.jpg",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = CryptoJs.AES.encrypt(
    `${this.password}`,
    `${process.env.CRYPTO_KEY}`
  ).toString();
});
//Export the model

userSchema.method(
  "isPasswordMatched",
  function isPasswordMatched(enterPassword: string) {
    const hashedPassword = CryptoJs.AES.decrypt(
      `${this.password}`,
      `${process.env.CRYPTO_KEY}`
    ).toString(CryptoJs.enc.Utf8);

    if (enterPassword === hashedPassword) {
      return true;
    } else {
      return false;
    }
  }
);
userSchema.method(
  "createPasswordResetToken",
  function createPasswordResetToken() {
    const resetToken = randombytes(32).toString("hex");
    this.passwordResetToken = CryptoJs.SHA256(resetToken);
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //30 minute
    return resetToken;
  }
);
export default mongoose.model("User", userSchema);
