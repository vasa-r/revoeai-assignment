const validateTable = (
  tableName: string,
  columns: { columnName: string; columnType: string }[]
) => {
  const errors: { tableName?: string; columns?: string[] } = { columns: [] };

  if (!tableName.trim()) {
    errors.tableName = "Table name is required.";
  }

  columns.forEach((col, index) => {
    if (!col.columnName.trim()) {
      errors.columns![index] = "Column name is required.";
    } else {
      errors.columns![index] = "";
    }
  });

  return errors;
};

export default validateTable;
