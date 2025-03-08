import { AxiosError } from "axios";
import apiClient from "./axiosConfig";

export interface Column {
  columnName: string;
  columnType: "Text" | "Date";
}

interface UpdateColumnValue {
  columnId: string;
  rowIndex: number;
  value: string;
}

const createColumn = async (
  tableId: string,
  columnName: string,
  columnType: "Date" | "Text"
) => {
  try {
    const response = await apiClient.post("/column", {
      tableId,
      columnName,
      columnType,
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

const updateColumnValues = async (updates: UpdateColumnValue[]) => {
  try {
    const response = await apiClient.patch("/column", { updates });

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

export { createColumn, updateColumnValues };
