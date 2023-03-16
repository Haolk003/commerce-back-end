"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const color_1 = require("../controller/color");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.post("/create", authMiddleWare_1.checkIsAdmin, color_1.createColor);
router.put("update", authMiddleWare_1.checkIsAdmin, color_1.updateColor);
router.get("/getColor/:id", color_1.getColor);
router.get("/getAll", color_1.getAllColor);
router.delete("/delete", color_1.deleteColor);
exports.default = router;
//# sourceMappingURL=color.js.map