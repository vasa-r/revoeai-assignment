import { Router } from "express";
import {
  getTableDataWithSheet,
  getCompleteTableData,
} from "../controllers/sheet-controller";

const sheetRouter = Router();

sheetRouter.get("/data", getTableDataWithSheet);

sheetRouter.get("/:tableId", getCompleteTableData);

export default sheetRouter;
