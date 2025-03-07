import { AxiosError } from "axios";
import apiClient from "./axiosConfig";

export interface Column {
  columnName: string;
  columnType: "Text" | "Date";
}

const createTable = async (tableName: string, columns: Column[]) => {
  console.log("tableName", tableName);
  console.log("columns", columns);
  try {
    const response = await apiClient.post("/table", {
      tableName,
      columns,
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred",
      status: err.response?.status || 500,
    };
  }
};

export { createTable };
