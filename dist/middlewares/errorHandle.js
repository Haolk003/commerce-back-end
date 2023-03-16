"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.handleError = void 0;
//not Found
const handleError = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(err);
    const errStatus = err.status || 500;
    const errMessage = err.message || "something went wrong ";
    return res.status(errStatus).json({
        success: false,
        message: errMessage,
        status: errStatus,
        stack: err.stack,
    });
});
exports.handleError = handleError;
const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};
exports.createError = createError;
//# sourceMappingURL=errorHandle.js.map