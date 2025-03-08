import { Request, Response } from "express";
import Table from "../models/table-model";
import Column, { IColumn } from "../models/column-model";
import { statusCode, tableUpdateData } from "../types/type";
import mongoose from "mongoose";

import { extractSheetId } from "../lib/utils";
import { checkSheetAccess } from "../config/google";

export const createTable = async (req: Request, res: Response) => {
  try {
    const { tableName, columns } = req.body;

    const userId = req.userId;

    const table = await Table.create({ tableName, userId });

    const now = new Date(); // just to have ordered time so that we can simply render column in order in client

    const columnDocs = (columns as Partial<IColumn>[]).map(
      ({ columnName, columnType }, index) => ({
        columnName,
        columnType,
        tableId: table._id,
        isDynamic: false,
        rows: [],
        createdAt: new Date(now.getTime() + index * 1000),
        updatedAt: new Date(now.getTime() + index * 1000),
      })
    );

    await Column.insertMany(columnDocs);

    res.status(statusCode.CREATED).json({
      success: true,
      message: "Table created successfully",
      data: {
        _id: table._id,
        tableName: table.tableName,
        columnCount: columnDocs.length,
        sheetConnected: "No",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while creating table.",
    });
    return;
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const { tableName, googleSheetId } = req.body;
    const { tableId } = req.params;

    const updateData: Partial<tableUpdateData> = {};

    if (tableName !== undefined) updateData.tableName = tableName;

    if (googleSheetId !== undefined) {
      try {
        const extractedId = extractSheetId(googleSheetId);

        if (!extractedId) {
          res.status(statusCode.FORBIDDEN).json({
            success: false,
            message: "Not a valid spreadsheet ID",
          });
          return;
        }
        const response = await checkSheetAccess(extractedId!);

        if (!response.success) {
          res.status(statusCode.FORBIDDEN).json({
            success: false,
            message: response.message || "No access to sheet",
          });
          return;
        }

        updateData.googleSheetId = extractedId;
      } catch (error) {
        res.status(statusCode.SERVER_ERROR).json({
          success: false,
          message: "An unexpected error occurred while checking sheet access.",
        });
        return;
      }
    }

    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedTable) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Table not found",
      });
      return;
    }

    res.status(statusCode.OK).json({
      success: true,
      message: "Table updated successfully",
      data: {
        tableName: updatedTable.tableName,
        googleSheetId: updatedTable.googleSheetId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while updating the table.",
    });
    return;
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params;

    const deletedTable = await Table.findByIdAndDelete(tableId);

    if (!deletedTable) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Table not found",
      });
      return;
    }

    await Column.deleteMany({ tableId });

    res.status(statusCode.OK).json({
      success: true,
      message: "Table and associated columns deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while deleting the table.",
    });
    return;
  }
};

export const getTableStat = async (req: Request, res: Response) => {
  const { userId } = req;
  try {
    const totalTables = await Table.countDocuments({ userId });

    const userTables = await Table.find({ userId }, "_id").lean();
    const tableIds = userTables.map((table) => table._id);
    const totalColumns = await Column.countDocuments({
      tableId: { $in: tableIds },
    });

    const totalGoogleSheetsLinked = await Table.countDocuments({
      userId,
      googleSheetId: { $ne: "" },
    });

    const tables = await Table.find(
      { userId },
      "tableName googleSheetId _id"
    ).lean();

    const tableStats = await Promise.all(
      tables.map(async (table) => {
        const columnCount = await Column.countDocuments({ tableId: table._id });

        return {
          _id: table._id,
          tableName: table.tableName,
          columnCount,
          sheetConnected: table.googleSheetId ? "Yes" : "No",
        };
      })
    );

    res.json({
      success: true,
      totalTables,
      totalColumns,
      totalGoogleSheetsLinked,
      tableStats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// it is created juts for testing purpose before i integrate sheet data with table
export const readTable = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params;

    if (!tableId) {
      res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Table ID is required",
      });
      return;
    }

    const tableData = await Table.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(tableId) },
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
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Table not found",
      });
      return;
    }

    res.status(statusCode.OK).json({
      success: true,
      message: "Table data fetched",
      data: tableData[0],
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while reading the table.",
    });
    return;
  }
};
