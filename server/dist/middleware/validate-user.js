"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserLogin = exports.validateNewUser = void 0;
const type_1 = require("../types/type");
const validateNewUser = (req, res, next) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        res.status(type_1.statusCode.BAD_REQUEST).json({
            success: false,
            message: "All fields are required.",
        });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(type_1.statusCode.BAD_REQUEST).json({
            success: false,
            message: "Invalid email format.",
        });
        return;
    }
    if (password.length < 6) {
        res.status(type_1.statusCode.BAD_REQUEST).json({
            success: false,
            message: "Password must be at least 6 characters.",
        });
        return;
    }
    next();
};
exports.validateNewUser = validateNewUser;
const validateUserLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(type_1.statusCode.BAD_REQUEST).json({
            success: false,
            message: "Email and password are required.",
        });
        return;
    }
    next();
};
exports.validateUserLogin = validateUserLogin;
