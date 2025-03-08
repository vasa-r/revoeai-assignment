import { Router } from "express";
import {
  createTable,
  deleteTable,
  getTableStat,
  readTable,
  updateTable,
} from "../controllers/table-controller";
import {
  validateNewTable,
  validateTableUpdate,
} from "../middleware/validate-table";

const tableRouter = Router();

tableRouter.get("/:tableId", readTable);

tableRouter.get("/", getTableStat);

tableRouter.post("/", validateNewTable, createTable);

tableRouter.patch("/:tableId", validateTableUpdate, updateTable);

tableRouter.delete("/:tableId", deleteTable);

export default tableRouter;
