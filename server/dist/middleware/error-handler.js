"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const isProduction = process.env.IS_PRODUCTION || "true";
    const response = {
        success: false,
        message: err.message || "An unexpected error occurred",
    };
    if (!isProduction) {
        response.error = err.stack || err.message || "Error details not available";
    }
    const statusCode = err.status || 500;
    res.status(statusCode).json(response);
};
exports.default = errorHandler;
