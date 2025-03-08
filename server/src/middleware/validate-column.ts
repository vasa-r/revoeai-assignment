import { Request, Response, NextFunction } from "express";
import { statusCode } from "../types/type";

export const validateNewColumn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { columnName, columnType, tableId } = req.body;

  if (!tableId) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "No Table ID",
    });
    return;
  }

  if (!columnName || !columnType) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "columnName and columnType are required.",
    });
    return;
  }

  if (!["Text", "Date"].includes(columnType)) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "Invalid columnType. Allowed values: 'Text', 'Date'.",
    });
    return;
  }

  next();
};
