import { Request, Response } from "express";
import User from "../models/user-model";
import { statusCode } from "../types";
import {
  comparePassword,
  generateHashedPassword,
  generateToken,
} from "../lib/utils";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    const isUserExists = await User.findOne({ email: email });

    if (isUserExists) {
      res.status(statusCode.CONFLICT).json({
        success: false,
        message: "User already exists please try to sign in",
      });
      return;
    }

    const hashedPassword = await generateHashedPassword(password);

    const createUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    res.status(statusCode.CREATED).json({
      success: true,
      message: `Please login to continue ${createUser.userName}`,
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while registering",
    });
    return;
  }
};

export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(statusCode.CONFLICT).json({
        success: false,
        message: "No user found. Please Sign Up",
      });
      return;
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      res.status(statusCode.NOT_ACCEPTABLE).json({
        success: false,
        message: "Incorrect Password. Please enter correct password",
      });
      return;
    }

    const token = generateToken(user._id, user.userName, user.email);

    res.status(statusCode.ACCEPTED).json({
      success: true,
      data: user,
      message: `Welcome ${user.userName}`,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(statusCode.SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while Logging in",
    });
    return;
  }
};
