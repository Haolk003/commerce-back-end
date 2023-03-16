"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_1 = require("../controller/brand");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/create", authMiddleWare_1.checkIsAdmin, brand_1.createBrand);
router.get("/get/:id", brand_1.getBrand);
router.get("/getAll", authMiddleWare_1.checkIsAdmin, brand_1.getAllBrand);
router.put("/update/:id", authMiddleWare_1.checkIsAdmin, brand_1.updateBrand);
router.delete("/delete/:id", authMiddleWare_1.checkIsAdmin, brand_1.deleteBrand);
exports.default = router;
//# sourceMappingURL=brand.js.map