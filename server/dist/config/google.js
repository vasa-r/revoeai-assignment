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
exports.checkSheetAccess = void 0;
const google_auth_library_1 = require("google-auth-library");
const google_spreadsheet_1 = require("google-spreadsheet");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serviceAccountAuth = new google_auth_library_1.JWT({
    email: "sheet-947@sheets-453116.iam.gserviceaccount.com",
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const checkSheetAccess = (spreadsheetId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const doc = new google_spreadsheet_1.GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
        yield doc.loadInfo();
        return { success: true, title: doc.title };
    }
    catch (error) {
        console.log(error);
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 403) {
            return {
                success: false,
                message: "Please give access to the provided email to your spreadsheet before proceeding.",
            };
        }
        return {
            success: false,
            message: "Invalid Spreadsheet ID or another error occurred.",
        };
    }
});
exports.checkSheetAccess = checkSheetAccess;
exports.default = serviceAccountAuth;
