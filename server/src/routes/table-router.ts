import { Router } from "express";
import {
  createTable,
  deleteTable,
  updateTable,
} from "../controllers/table-controller";
import {
  validateNewTable,
  validateTableUpdate,
} from "../middleware/validate-table";

const tableRouter = Router();

tableRouter.post("/", validateNewTable, createTable);

tableRouter.put("/", validateTableUpdate, updateTable);

tableRouter.delete("/:tableId", deleteTable);

export default tableRouter;
