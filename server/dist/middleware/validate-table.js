"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTableUpdate = exports.validateNewTable = void 0;
const type_1 = require("../types/type");
const validateNewTable = (req, res, next) => {
    const { tableName, columns } = req.body;
    if (!tableName || !Array.isArray(columns) || columns.length === 0) {
        res.status(type_1.statusCode.BAD_REQUEST).json({
            success: false,
            message: "Invalid input data",
        });
        return;
    }
    next();
};
exports.validateNewTable = validateNewTable;
const validateTableUpdate = (req, res, next) => {
    const { tableName, googleSheetId } = req.body;
    if (!tableName && !googleSheetId) {
        res.status(400).json({
            success: false,
            message: "At least one field (tableName or googleSheetId) is required for updating.",
        });
        return;
    }
    if (tableName !== undefined && typeof tableName !== "string") {
        res.status(400).json({
            success: false,
            message: "Invalid tableName. It should be a non-empty string.",
        });
        return;
    }
    if (googleSheetId !== undefined && typeof googleSheetId !== "string") {
        res.status(400).json({
            success: false,
            message: "Invalid googleSheetId. It should be a string.",
        });
        return;
    }
    next();
};
exports.validateTableUpdate = validateTableUpdate;
