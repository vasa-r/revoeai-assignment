import { Request, Response } from "express";
import fetchGoogleSheetData from "../services/google-services";
import { statusCode } from "../types/type";
import Table from "../models/table-model";
import Column from "../models/column-model";

// for testing created
export const getTableDataWithSheet = async (req: Request, res: Response) => {
  try {
    const spreadsheetId = req.body.spreadsheetId;
    const { headers, data } = await fetchGoogleSheetData(spreadsheetId);

    res.json({ headers, data });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while deleting the table.",
    });
    return;
  }
};

export const getCompleteTableData = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params;
    if (!tableId) {
      res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Table ID is required",
      });
      return;
    }

    const table = await Table.findById(tableId);
    if (!table) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Table not found",
      });
      return;
    }

    const dbColumns = await Column.find({ tableId });

    const nonDynamicDbColumns = dbColumns.filter((col) => !col.isDynamic);
    const dynamicDbColumns = dbColumns.filter((col) => col.isDynamic);

    let sheetColumns: any[] = [];
    let sheetRows: any[] = [];

    if (table.googleSheetId) {
      const { headers, data } = await fetchGoogleSheetData(table.googleSheetId);

      sheetColumns = headers.map((header) => ({
        columnName: header,
        columnType: "Text",
        isDynamic: false,
        rows: [],
      }));

      sheetRows = data;
    }

    const mergedNonDynamicColumns = nonDynamicDbColumns.map((col) => {
      const sheetColumn = sheetColumns.find(
        (sheetCol) => sheetCol.columnName === col.columnName
      );

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
        ? col.rows.map((row: { value: any; createdAt: any }) => ({
            value: row.value,
            createdAt: row.createdAt,
          }))
        : [],
    }));

    const allColumns = [...mergedNonDynamicColumns, ...formattedDynamicColumns];

    res.status(statusCode.OK).json({
      success: true,
      message: "Table data fetched successfully",
      tableId: table._id,
      tableName: table.tableName,
      googleSheetId: table.googleSheetId,
      columns: allColumns,
    });
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while fetching the table data.",
    });
  }
};
