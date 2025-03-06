import { Request, Response } from "express";
import Column from "../models/column-model";
import Table from "../models/table-model";
import { statusCode } from "../types";

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

export const updateColumn = (req: Request, res: Response) => {};

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
