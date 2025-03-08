"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: "No token provided",
            });
            return;
        }
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token) {
            res.status(400).json({
                success: false,
                message: "Invalid token format",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
        else {
            res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            success: false,
            message: err.message
                ? `${err.message}. Please login again.`
                : "error occurred during token verification",
        });
        return;
    }
};
exports.default = verifyToken;
