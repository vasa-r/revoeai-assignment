"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sheet_controller_1 = require("../controllers/sheet-controller");
const sheetRouter = (0, express_1.Router)();
sheetRouter.get("/data", sheet_controller_1.getTableDataWithSheet);
sheetRouter.get("/:tableId", sheet_controller_1.getCompleteTableData);
exports.default = sheetRouter;
