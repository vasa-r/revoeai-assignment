import { Request, Response } from "express";
import Column from "../models/column-model";
import Table from "../models/table-model";
import { statusCode } from "../types/type";

export const createColumn = async (req: Request, res: Response) => {
  try {
    const { columnName, columnType, tableId } = req.body;

    const tableExists = await Table.findById(tableId);

    if (!tableExists) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Table not found.",
      });
      return;
    }

    const newColumn = await Column.create({
      columnName,
      columnType,
      tableId,
      isDynamic: true,
      rows: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(statusCode.CREATED).json({
      success: true,
      message: "Column created successfully",
      data: newColumn,
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while creating the column.",
    });
    return;
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  try {
    const { updates } = req.body;
    let updatedColumns = [];

    for (const { columnId, rowIndex, value } of updates) {
      const column = await Column.findById(columnId);

      if (!column) {
        res.status(404).json({ success: false, message: "Column not found" });
        return;
      }

      const PLACEHOLDER_VALUE = "__EMPTY__";

      while (column.rows.length <= rowIndex) {
        column.rows.push({ value: PLACEHOLDER_VALUE });
      }

      column.rows[rowIndex].value = value ?? PLACEHOLDER_VALUE;

      await column.save();

      updatedColumns.push(column);
    }

    res.status(statusCode.OK).json({
      success: true,
      message: "Data saved successfully",
      data: updatedColumns,
    });
  } catch (error) {
    console.error("Error updating MongoDB:", error);
    res
      .status(statusCode.SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { columnId } = req.params;

    const column = await Column.findById(columnId);

    if (!column) {
      res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "Column not found.",
      });
      return;
    }

    await Column.findByIdAndDelete(columnId);

    res.status(statusCode.OK).json({
      success: true,
      message: "Column deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while deleting the column.",
    });
    return;
  }
};
