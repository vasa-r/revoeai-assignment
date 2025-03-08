import Table from "../models/table-model";

export const getTableById = async (tableId: string) => {
  try {
    const table = await Table.findById(tableId).exec();

    if (!table) {
      throw new Error("Table not found");
    }

    return table;
  } catch (error) {
    throw new Error("Error fetching table: " + error);
  }
};
