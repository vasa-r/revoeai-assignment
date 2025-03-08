import { AxiosError } from "axios";
import apiClient from "./axiosConfig";

export interface Column {
  columnName: string;
  columnType: "Text" | "Date";
}

const createTable = async (tableName: string, columns: Column[]) => {
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

const getTableData = async (tableId: string) => {
  try {
    const response = await apiClient.get(`/sheet/${tableId}`);

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

const getStatData = async () => {
  try {
    const response = await apiClient.get(`/table`);

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

const updateTable = async (
  tableId: string,
  updateData: { tableName?: string; googleSheetId?: string }
) => {
  try {
    const response = await apiClient.patch(`/table/${tableId}`, updateData);

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

const deleteTable = async (tableId: string) => {
  try {
    const response = await apiClient.delete(`/table/${tableId}`);

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

export { createTable, getTableData, updateTable, getStatData, deleteTable };
