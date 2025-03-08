export interface TableData {
  success: boolean;
  message: string;
  tableId: string;
  tableName: string;
  googleSheetId: string;
  columns: Column[];
}

export interface Column {
  columnName: string;
  columnType: "Text" | "Date";
  isDynamic: boolean;
  rows: Row[];
}

export interface Row {
  value: string;
  createdAt: string;
}
