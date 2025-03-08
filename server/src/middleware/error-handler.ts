import { Request, Response, NextFunction } from "express";
import { responseType, CustomError } from "../types/type";

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const isProduction = process.env.IS_PRODUCTION || "true";

  const response: responseType = {
    success: false,
    message: err.message || "An unexpected error occurred",
  };

  if (!isProduction) {
    response.error = err.stack || err.message || "Error details not available";
  }

  const statusCode = err.status || 500;

  res.status(statusCode).json(response);
};

export default errorHandler;
