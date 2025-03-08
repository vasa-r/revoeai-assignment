export interface TableData {
  success: boolean;
  message: string;
  tableId: string;
  tableName: string;
  googleSheetId: string;
  columns: Column[];
  _id: string;
}

export interface Column {
  columnName: string;
  columnType: "Text" | "Date";
  isDynamic: boolean;
  rows: Row[];
  _id: string;
}

export interface Row {
  value: string;
  createdAt: string;
}
