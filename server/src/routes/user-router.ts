import { Router } from "express";
import { createUser, authenticateUser } from "../controllers/user-controller";

const userRouter = Router();

userRouter.post("/signup", createUser);
userRouter.post("/signin", authenticateUser);

export default userRouter;
