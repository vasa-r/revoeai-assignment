import { Request, Response, NextFunction } from "express";
import { statusCode } from "../types/type";

export const validateNewUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "All fields are required.",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "Invalid email format.",
    });
    return;
  }

  if (password.length < 6) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "Password must be at least 6 characters.",
    });
    return;
  }

  next();
};

export const validateUserLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: "Email and password are required.",
    });
    return;
  }

  next();
};
