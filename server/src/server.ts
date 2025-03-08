import express, { Application } from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import connectDb from "./config/connect-db";
import userRouter from "./routes/user-router";
import tableRouter from "./routes/table-router";
import columnRouter from "./routes/column-router";
import errorHandler from "./middleware/error-handler";
import verifyToken from "./middleware/verify-token";
import sheetRouter from "./routes/sheet-router";
import { setupWebSocketServer } from "./config/ws-handler";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

const wss = setupWebSocketServer(server);

server.on("upgrade", (request, socket, head) => {
  console.log("WebSocket upgrade request received");
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({ success: true, message: "API is up and running" });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/table", verifyToken, tableRouter);
app.use("/api/v1/column", verifyToken, columnRouter);
app.use("/api/v1/sheet", verifyToken, sheetRouter);

app.use("*", (_, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

app.use(errorHandler);

server.listen(PORT, async () => {
  await connectDb();
  console.log(`Server running on  PORT:${PORT}`);
});
