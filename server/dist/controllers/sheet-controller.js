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
exports.getCompleteTableData = exports.getTableDataWithSheet = void 0;
const google_services_1 = __importDefault(require("../services/google-services"));
const type_1 = require("../types/type");
const table_model_1 = __importDefault(require("../models/table-model"));
const column_model_1 = __importDefault(require("../models/column-model"));
// for testing created
const getTableDataWithSheet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const spreadsheetId = req.body.spreadsheetId;
        const { headers, data } = yield (0, google_services_1.default)(spreadsheetId);
        res.json({ headers, data });
    }
    catch (error) {
        console.error(error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while deleting the table.",
        });
        return;
    }
});
exports.getTableDataWithSheet = getTableDataWithSheet;
const getCompleteTableData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableId } = req.params;
        if (!tableId) {
            res.status(type_1.statusCode.BAD_REQUEST).json({
                success: false,
                message: "Table ID is required",
            });
            return;
        }
        const table = yield table_model_1.default.findById(tableId);
        if (!table) {
            res.status(type_1.statusCode.NOT_FOUND).json({
                success: false,
                message: "Table not found",
            });
            return;
        }
        const dbColumns = yield column_model_1.default.find({ tableId });
        const nonDynamicDbColumns = dbColumns.filter((col) => !col.isDynamic);
        const dynamicDbColumns = dbColumns.filter((col) => col.isDynamic);
        let sheetColumns = [];
        let sheetRows = [];
        if (table.googleSheetId) {
            const { headers, data } = yield (0, google_services_1.default)(table.googleSheetId);
            sheetColumns = headers.map((header) => ({
                columnName: header,
                columnType: "Text",
                isDynamic: false,
                rows: [],
            }));
            sheetRows = data;
        }
        const mergedNonDynamicColumns = nonDynamicDbColumns.map((col) => {
            const sheetColumn = sheetColumns.find((sheetCol) => sheetCol.columnName === col.columnName);
            return {
                _id: col._id,
                columnName: col.columnName,
                columnType: col.columnType,
                isDynamic: false,
                rows: sheetColumn
                    ? sheetRows.map((row) => ({
                        value: row[col.columnName] || "",
                        createdAt: new Date(),
                    }))
                    : [],
            };
        });
        const formattedDynamicColumns = dynamicDbColumns.map((col) => ({
            _id: col._id,
            columnName: col.columnName,
            columnType: col.columnType,
            isDynamic: true,
            rows: col.rows
                ? col.rows.map((row) => ({
                    value: row.value,
                    createdAt: row.createdAt,
                }))
                : [],
        }));
        const allColumns = [...mergedNonDynamicColumns, ...formattedDynamicColumns];
        res.status(type_1.statusCode.OK).json({
            success: true,
            message: "Table data fetched successfully",
            tableId: table._id,
            tableName: table.tableName,
            googleSheetId: table.googleSheetId,
            columns: allColumns,
        });
    }
    catch (error) {
        console.error("Error fetching table data:", error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while fetching the table data.",
        });
    }
});
exports.getCompleteTableData = getCompleteTableData;
