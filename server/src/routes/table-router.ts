import { Router } from "express";
import {
  createTable,
  deleteTable,
  readTable,
  updateTable,
} from "../controllers/table-controller";
import {
  validateNewTable,
  validateTableUpdate,
} from "../middleware/validate-table";

const tableRouter = Router();

tableRouter.get("/:tableId", readTable);

tableRouter.post("/", validateNewTable, createTable);

tableRouter.patch("/:tableId", validateTableUpdate, updateTable);

tableRouter.delete("/:tableId", deleteTable);

export default tableRouter;
