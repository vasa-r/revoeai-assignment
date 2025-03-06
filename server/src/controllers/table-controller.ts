import { Request, Response } from "express";
import Table from "../models/table-model";
import Column, { IColumn } from "../models/column-model";
import { statusCode, tableUpdateData } from "../types";

export const createTable = async (req: Request, res: Response) => {
  try {
    const { tableName, columns } = req.body;
    const { userId } = req;

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
    if (googleSheetId !== undefined) updateData.googleSheetId = googleSheetId;

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
      data: updatedTable,
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
