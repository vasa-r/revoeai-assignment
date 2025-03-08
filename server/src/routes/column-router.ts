import { Router } from "express";
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from "../controllers/column-controller";
import { validateNewColumn } from "../middleware/validate-column";

const columnRouter = Router();

columnRouter.post("/", validateNewColumn, createColumn);

columnRouter.patch("/", updateColumn);

columnRouter.delete("/:columnId", deleteColumn);

export default columnRouter;
