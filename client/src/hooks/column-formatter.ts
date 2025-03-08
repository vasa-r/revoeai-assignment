const getFormattedData = (editedData: Record<string, string>) => {
  return Object.entries(editedData).map(([key, value]) => {
    const [columnId, rowIndex] = key.split("-");
    return {
      columnId,
      rowIndex: parseInt(rowIndex, 10),
      value,
    };
  });
};

export default getFormattedData;
