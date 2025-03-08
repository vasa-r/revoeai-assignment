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
exports.readTable = exports.getTableStat = exports.deleteTable = exports.updateTable = exports.createTable = void 0;
const table_model_1 = __importDefault(require("../models/table-model"));
const column_model_1 = __importDefault(require("../models/column-model"));
const type_1 = require("../types/type");
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../lib/utils");
const google_1 = require("../config/google");
const createTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableName, columns } = req.body;
        const userId = req.userId;
        const table = yield table_model_1.default.create({ tableName, userId });
        const now = new Date(); // just to have ordered time so that we can simply render column in order in client
        const columnDocs = columns.map(({ columnName, columnType }, index) => ({
            columnName,
            columnType,
            tableId: table._id,
            isDynamic: false,
            rows: [],
            createdAt: new Date(now.getTime() + index * 1000),
            updatedAt: new Date(now.getTime() + index * 1000),
        }));
        yield column_model_1.default.insertMany(columnDocs);
        res.status(type_1.statusCode.CREATED).json({
            success: true,
            message: "Table created successfully",
            data: {
                _id: table._id,
                tableName: table.tableName,
                columnCount: columnDocs.length,
                sheetConnected: "No",
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while creating table.",
        });
        return;
    }
});
exports.createTable = createTable;
const updateTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableName, googleSheetId } = req.body;
        const { tableId } = req.params;
        const updateData = {};
        if (tableName !== undefined)
            updateData.tableName = tableName;
        if (googleSheetId !== undefined) {
            try {
                const extractedId = (0, utils_1.extractSheetId)(googleSheetId);
                if (!extractedId) {
                    res.status(type_1.statusCode.FORBIDDEN).json({
                        success: false,
                        message: "Not a valid spreadsheet ID",
                    });
                    return;
                }
                const response = yield (0, google_1.checkSheetAccess)(extractedId);
                if (!response.success) {
                    res.status(type_1.statusCode.FORBIDDEN).json({
                        success: false,
                        message: response.message || "No access to sheet",
                    });
                    return;
                }
                updateData.googleSheetId = extractedId;
            }
            catch (error) {
                res.status(type_1.statusCode.SERVER_ERROR).json({
                    success: false,
                    message: "An unexpected error occurred while checking sheet access.",
                });
                return;
            }
        }
        const updatedTable = yield table_model_1.default.findByIdAndUpdate(tableId, { $set: updateData }, { new: true });
        if (!updatedTable) {
            res.status(type_1.statusCode.NOT_FOUND).json({
                success: false,
                message: "Table not found",
            });
            return;
        }
        res.status(type_1.statusCode.OK).json({
            success: true,
            message: "Table updated successfully",
            data: {
                tableName: updatedTable.tableName,
                googleSheetId: updatedTable.googleSheetId,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while updating the table.",
        });
        return;
    }
});
exports.updateTable = updateTable;
const deleteTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableId } = req.params;
        const deletedTable = yield table_model_1.default.findByIdAndDelete(tableId);
        if (!deletedTable) {
            res.status(type_1.statusCode.NOT_FOUND).json({
                success: false,
                message: "Table not found",
            });
            return;
        }
        yield column_model_1.default.deleteMany({ tableId });
        res.status(type_1.statusCode.OK).json({
            success: true,
            message: "Table and associated columns deleted successfully",
        });
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
exports.deleteTable = deleteTable;
const getTableStat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    try {
        const totalTables = yield table_model_1.default.countDocuments({ userId });
        const userTables = yield table_model_1.default.find({ userId }, "_id").lean();
        const tableIds = userTables.map((table) => table._id);
        const totalColumns = yield column_model_1.default.countDocuments({
            tableId: { $in: tableIds },
        });
        const totalGoogleSheetsLinked = yield table_model_1.default.countDocuments({
            userId,
            googleSheetId: { $ne: "" },
        });
        const tables = yield table_model_1.default.find({ userId }, "tableName googleSheetId _id").lean();
        const tableStats = yield Promise.all(tables.map((table) => __awaiter(void 0, void 0, void 0, function* () {
            const columnCount = yield column_model_1.default.countDocuments({ tableId: table._id });
            return {
                _id: table._id,
                tableName: table.tableName,
                columnCount,
                sheetConnected: table.googleSheetId ? "Yes" : "No",
            };
        })));
        res.json({
            success: true,
            totalTables,
            totalColumns,
            totalGoogleSheetsLinked,
            tableStats,
        });
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTableStat = getTableStat;
// it is created juts for testing purpose before i integrate sheet data with table
const readTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableId } = req.params;
        if (!tableId) {
            res.status(type_1.statusCode.BAD_REQUEST).json({
                success: false,
                message: "Table ID is required",
            });
            return;
        }
        const tableData = yield table_model_1.default.aggregate([
            {
                $match: { _id: new mongoose_1.default.Types.ObjectId(tableId) },
            },
            {
                $lookup: {
                    from: "columns",
                    localField: "_id",
                    foreignField: "tableId",
                    as: "columns",
                },
            },
            {
                $project: {
                    _id: 1,
                    tableName: 1,
                    googleSheetId: 1,
                    createdAt: 1,
                    columns: {
                        _id: 1,
                        columnName: 1,
                        columnType: 1,
                        isDynamic: 1,
                        rows: 1,
                        createdAt: 1,
                    },
                },
            },
        ]);
        if (!tableData.length) {
            res.status(type_1.statusCode.NOT_FOUND).json({
                success: false,
                message: "Table not found",
            });
            return;
        }
        res.status(type_1.statusCode.OK).json({
            success: true,
            message: "Table data fetched",
            data: tableData[0],
        });
    }
    catch (error) {
        console.error(error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while reading the table.",
        });
        return;
    }
});
exports.readTable = readTable;
