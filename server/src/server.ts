import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/connect-db";
import userRouter from "./routes/user-router";
import tableRouter from "./routes/table-router";
import columnRouter from "./routes/column-router";
import errorHandler from "./middleware/error-handler";

dotenv.config();

const app: Application = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "API is up and running",
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/table", tableRouter);
app.use("/api/v1/column", columnRouter);

app.use("*", (_, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDb();
});
