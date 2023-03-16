"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMongoDbId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandle_1 = require("../src/middlewares/errorHandle");
const validateMongoDbId = (id) => {
    const isValid = mongoose_1.default.Types.ObjectId.isValid(id);
    if (!isValid)
        return (0, errorHandle_1.createError)(500, "This id is not valid or not Found");
};
exports.validateMongoDbId = validateMongoDbId;
//# sourceMappingURL=validateId.js.map