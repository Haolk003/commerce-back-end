"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const db_connect_1 = __importDefault(require("./config/db.connect"));
const auth_1 = __importDefault(require("./routers/auth"));
const user_1 = __importDefault(require("./routers/user"));
const products_1 = __importDefault(require("./routers/products"));
const product_category_1 = __importDefault(require("./routers/product-category"));
const coupon_1 = __importDefault(require("./routers/coupon"));
const cart_1 = __importDefault(require("./routers/cart"));
const order_1 = __importDefault(require("./routers/order"));
const upload_1 = __importDefault(require("./routers/upload"));
const errorHandle_1 = require("./middlewares/errorHandle");
dotenv.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
(0, db_connect_1.default)();
const port = process.env.PORT || 5000;
app.use("/api/auth", auth_1.default);
app.use("/api/users", user_1.default);
app.use("/api/products", products_1.default);
app.use("/api/product-categories", product_category_1.default);
app.use("/api/coupons", coupon_1.default);
app.use("/api/cart", cart_1.default);
app.use("/api/orders", order_1.default);
app.use("/api/upload", upload_1.default);
app.use(errorHandle_1.handleError);
app.listen(port, () => {
    console.log(`Sever running at PORT ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map