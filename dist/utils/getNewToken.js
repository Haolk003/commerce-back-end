"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getNewAccessToken(refreshToken) {
    return new Promise((resolve, reject) => {
        // Verify the refresh token
        jsonwebtoken_1.default.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else {
                // Create a new access token
                const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id, isAdmin: decoded.isAdmin }, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: "15m" });
                resolve(accessToken);
            }
        });
    });
}
exports.default = getNewAccessToken;
//# sourceMappingURL=getNewToken.js.map