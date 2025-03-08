"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
const validate_user_1 = require("../middleware/validate-user");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", validate_user_1.validateNewUser, user_controller_1.createUser);
userRouter.post("/signin", validate_user_1.validateUserLogin, user_controller_1.authenticateUser);
exports.default = userRouter;
