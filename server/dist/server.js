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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_db_1 = __importDefault(require("./config/connect-db"));
const user_router_1 = __importDefault(require("./routes/user-router"));
const table_router_1 = __importDefault(require("./routes/table-router"));
const column_router_1 = __importDefault(require("./routes/column-router"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const verify_token_1 = __importDefault(require("./middleware/verify-token"));
const sheet_router_1 = __importDefault(require("./routes/sheet-router"));
const ws_handler_1 = require("./config/ws-handler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 8000;
const wss = (0, ws_handler_1.setupWebSocketServer)(server);
server.on("upgrade", (request, socket, head) => {
    console.log("WebSocket upgrade request received");
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.status(200).json({ success: true, message: "API is up and running" });
});
app.use("/api/v1/user", user_router_1.default);
app.use("/api/v1/table", verify_token_1.default, table_router_1.default);
app.use("/api/v1/column", verify_token_1.default, column_router_1.default);
app.use("/api/v1/sheet", verify_token_1.default, sheet_router_1.default);
app.use("*", (_, res) => {
    res.status(404).json({ success: false, message: "Endpoint not found" });
});
app.use(error_handler_1.default);
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_db_1.default)();
    console.log(`Server running on  PORT:${PORT}`);
}));
