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
exports.fetchGoogleSheetData = void 0;
const google_spreadsheet_1 = require("google-spreadsheet");
const google_auth_library_1 = require("google-auth-library");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serviceAccountAuth = new google_auth_library_1.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const fetchGoogleSheetData = (spreadsheetId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new google_spreadsheet_1.GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
        yield doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = yield sheet.getRows();
        const headers = sheet.headerValues;
        const data = rows.map((row) => headers.reduce((acc, header) => {
            acc[header] = row.get(header) || "";
            return acc;
        }, {}));
        return { headers, data };
    }
    catch (error) {
        console.error("Error fetching Google Sheet data:", error);
        throw new Error("Failed to fetch data from Google Sheets");
    }
});
exports.fetchGoogleSheetData = fetchGoogleSheetData;
exports.default = exports.fetchGoogleSheetData;
