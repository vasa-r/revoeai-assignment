import { Router } from "express";
import { createUser, authenticateUser } from "../controllers/user-controller";
import {
  validateNewUser,
  validateUserLogin,
} from "../middleware/validate-user";

const userRouter = Router();

userRouter.post("/signup", validateNewUser, createUser);
userRouter.post("/signin", validateUserLogin, authenticateUser);

export default userRouter;
