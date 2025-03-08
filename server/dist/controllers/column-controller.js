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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteColumn = exports.updateColumn = exports.createColumn = void 0;
const column_model_1 = __importDefault(require("../models/column-model"));
const table_model_1 = __importDefault(require("../models/table-model"));
const type_1 = require("../types/type");
const createColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { columnName, columnType, tableId } = req.body;
        const tableExists = yield table_model_1.default.findById(tableId);
        if (!tableExists) {
            res.status(type_1.statusCode.NOT_FOUND).json({
                success: false,
                message: "Table not found.",
            });
            return;
        }
        const newColumn = yield column_model_1.default.create({
            columnName,
            columnType,
            tableId,
            isDynamic: true,
            rows: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        res.status(type_1.statusCode.CREATED).json({
            success: true,
            message: "Column created successfully",
            data: newColumn,
        });
    }
    catch (error) {
        console.error(error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while creating the column.",
        });
        return;
    }
});
exports.createColumn = createColumn;
const updateColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { updates } = req.body;
        let updatedColumns = [];
        for (const { columnId, rowIndex, value } of updates) {
            const column = yield column_model_1.default.findById(columnId);
            if (!column) {
                res.status(404).json({ success: false, message: "Column not found" });
                return;
            }
            const PLACEHOLDER_VALUE = "__EMPTY__";
            while (column.rows.length <= rowIndex) {
                column.rows.push({ value: PLACEHOLDER_VALUE });
            }
            column.rows[rowIndex].value = value !== null && value !== void 0 ? value : PLACEHOLDER_VALUE;
            yield column.save();
            updatedColumns.push(column);
        }
        res.status(type_1.statusCode.OK).json({
            success: true,
            message: "Data saved successfully",
            data: updatedColumns,
        });
    }
    catch (error) {
        console.error("Error updating MongoDB:", error);
        res
            .status(type_1.statusCode.SERVER_ERROR)
            .json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateColumn = updateColumn;
const deleteColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { columnId } = req.params;
        const column = yield column_model_1.default.findById(columnId);
        if (!column) {
            res.status(type_1.statusCode.NOT_FOUND).json({
                success: false,
                message: "Column not found.",
            });
            return;
        }
        yield column_model_1.default.findByIdAndDelete(columnId);
        res.status(type_1.statusCode.OK).json({
            success: true,
            message: "Column deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while deleting the column.",
        });
        return;
    }
});
exports.deleteColumn = deleteColumn;
