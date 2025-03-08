"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user-model"));
const type_1 = require("../types/type");
const utils_1 = require("../lib/utils");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const isUserExists = yield user_model_1.default.findOne({ email: email });
        if (isUserExists) {
            res.status(type_1.statusCode.CONFLICT).json({
                success: false,
                message: "User already exists please try to sign in",
            });
            return;
        }
        const hashedPassword = yield (0, utils_1.generateHashedPassword)(password);
        const createUser = yield user_model_1.default.create({
            userName,
            email,
            password: hashedPassword,
        });
        res.status(type_1.statusCode.CREATED).json({
            success: true,
            message: `Please login to continue ${createUser.userName}`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while registering",
        });
        return;
    }
});
exports.createUser = createUser;
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            res.status(type_1.statusCode.CONFLICT).json({
                success: false,
                message: "No user found. Please Sign Up",
            });
            return;
        }
        const isMatch = yield (0, utils_1.comparePassword)(password, user.password);
        if (!isMatch) {
            res.status(type_1.statusCode.NOT_ACCEPTABLE).json({
                success: false,
                message: "Incorrect Password. Please enter correct password",
            });
            return;
        }
        const token = (0, utils_1.generateToken)(user._id);
        res.status(type_1.statusCode.ACCEPTED).json({
            success: true,
            userData: {
                userName: user.userName,
                email: user.email,
            },
            message: `Welcome ${user.userName}`,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(type_1.statusCode.SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while Logging in",
        });
        return;
    }
});
exports.authenticateUser = authenticateUser;
