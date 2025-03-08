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
exports.setupWebSocketServer = void 0;
const ws_1 = __importDefault(require("ws"));
const google_services_1 = __importDefault(require("../services/google-services"));
const get_table_1 = require("../lib/get-table");
const utils_1 = require("../lib/utils");
const clients = {};
const setupWebSocketServer = (server) => {
    const wss = new ws_1.default.Server({ noServer: true });
    wss.on("connection", (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("WebSocket connection established");
        const url = new URL(req.url, `http://${req.headers.host}`);
        const token = url.searchParams.get("token");
        const tableId = url.searchParams.get("tableId");
        if (!token || !tableId) {
            ws.close();
            console.log("Missing token or tableId in the URL");
            return;
        }
        let userId;
        try {
            const decoded = (0, utils_1.verifyUser)(token);
            userId = decoded.userId;
        }
        catch (error) {
            ws.close();
            console.error("Invalid or expired token:", error);
            return;
        }
        console.log(`WebSocket connection established for UserId: ${userId}, TableId: ${tableId}`);
        try {
            const table = yield (0, get_table_1.getTableById)(tableId);
            if (!table) {
                ws.close();
                console.log(`No table found with tableId: ${tableId}`);
                return;
            }
            const spreadsheetId = table.googleSheetId;
            clients[userId] = { ws, spreadsheetId };
            const { data } = yield (0, google_services_1.default)(spreadsheetId);
            clients[userId].lastKnownData = data;
        }
        catch (error) {
            console.error("Error loading initial sheet data:", error);
        }
        ws.on("close", () => {
            delete clients[userId];
            console.log(`WebSocket disconnected for User: ${userId}`);
        });
    }));
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        for (const userId in clients) {
            const { ws, spreadsheetId, lastKnownData } = clients[userId];
            try {
                const { data } = yield (0, google_services_1.default)(spreadsheetId);
                if (JSON.stringify(data) !== JSON.stringify(lastKnownData)) {
                    console.log(`Table updated for User ${userId}`);
                    if (ws.readyState === ws_1.default.OPEN) {
                        ws.send(JSON.stringify({ data }));
                    }
                    clients[userId].lastKnownData = data;
                }
            }
            catch (error) {
                console.error(`Error monitoring sheet for User ${userId}:`, error);
            }
        }
    }), 5000);
    return wss;
};
exports.setupWebSocketServer = setupWebSocketServer;
