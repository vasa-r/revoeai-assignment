import { Router } from "express";
import {
  createTable,
  deleteTable,
  updateTable,
} from "../controllers/table-controller";

const tableRouter = Router();

tableRouter.post("/", createTable);

tableRouter.put("/", updateTable);

tableRouter.delete("/:tableId", deleteTable);

export default tableRouter;
