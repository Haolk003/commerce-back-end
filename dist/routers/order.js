"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = require("../controller/order");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/create", authMiddleWare_1.authMiddleware, order_1.createOrder);
router.get("/getOrder/:orderId", authMiddleWare_1.authMiddleware, order_1.getOrders);
router.put("/update/:orderId", authMiddleWare_1.checkIsAdmin, order_1.updateOrderStatus);
router.get("/getAll", authMiddleWare_1.checkIsAdmin, order_1.getAllOrder);
router.get("/classify", authMiddleWare_1.checkIsAdmin, order_1.classifyOrder);
router.get("/aggOrder", authMiddleWare_1.checkIsAdmin, order_1.aggOrder);
router.get("/totalWeekly", authMiddleWare_1.checkIsAdmin, order_1.totalWeekly);
exports.default = router;
//# sourceMappingURL=order.js.map