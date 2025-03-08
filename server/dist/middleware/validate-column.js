"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNewColumn = void 0;
const type_1 = require("../types/type");
const validateNewColumn = (req, res, next) => {
    const { columnName, columnType, tableId } = req.body;
    if (!tableId) {
        res.status(type_1.statusCode.BAD_REQUEST).json({
            success: false,
            message: "No Table ID",
        });
        return;
    }
    if (!columnName || !columnType) {
        res.status(type_1.statusCode.BAD_REQUEST).json({
            success: false,
            message: "columnName and columnType are required.",
        });
        return;
    }
    if (!["Text", "Date"].includes(columnType)) {
        res.status(type_1.statusCode.BAD_REQUEST).json({
            success: false,
            message: "Invalid columnType. Allowed values: 'Text', 'Date'.",
        });
        return;
    }
    next();
};
exports.validateNewColumn = validateNewColumn;
