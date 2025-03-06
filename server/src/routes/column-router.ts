import { Router } from "express";
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from "../controllers/column-controller";

const columnRouter = Router();

columnRouter.post("/", createColumn);

columnRouter.put("/", updateColumn);

columnRouter.delete("/:tableId", deleteColumn);

export default columnRouter;
