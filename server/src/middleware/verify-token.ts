import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

interface JwtPayloadWithUserId extends JwtPayload {
  userId: string;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(400).json({
        success: false,
        message: "Invalid token format",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayloadWithUserId;

    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
  } catch (error) {
    const err = error as JsonWebTokenError;
    res.status(400).json({
      success: false,
      message: err.message
        ? `${err.message}. Please login again.`
        : "error occurred during token verification",
    });
    return;
  }
};

export default verifyToken;
