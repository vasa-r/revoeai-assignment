import { NextFunction, Request, Response } from "express";
import { statusCode } from "../types/type";

export const validateNewTable = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tableName, columns } = req.body;

  if (!tableName || !Array.isArray(columns) || columns.length === 0) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "Invalid input data",
    });
    return;
  }

  next();
};

export const validateTableUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tableName, googleSheetId } = req.body;

  if (!tableName && !googleSheetId) {
    res.status(400).json({
      success: false,
      message:
        "At least one field (tableName or googleSheetId) is required for updating.",
    });
    return;
  }

  if (tableName !== undefined && typeof tableName !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid tableName. It should be a non-empty string.",
    });
    return;
  }

  if (googleSheetId !== undefined && typeof googleSheetId !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid googleSheetId. It should be a string.",
    });
    return;
  }

  next();
};
