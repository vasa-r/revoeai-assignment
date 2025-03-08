"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getStatData } from "@/api/table";

export interface TableStat {
  _id: string;
  tableName: string;
  columnCount: number;
  sheetConnected: string;
}

interface StatsData {
  totalTables: number;
  totalColumns: number;
  totalGoogleSheetsLinked: number;
  tableStats: TableStat[];
}

interface StatsContextType {
  stats: StatsData;
  loading: boolean;
  refreshStats: () => void;
  addTableStat: (newTable: TableStat) => void;
  removeTableStat: (tableId: string) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth(); // Ensure user is logged in
  const [stats, setStats] = useState<StatsData>({
    totalTables: 0,
    totalColumns: 0,
    totalGoogleSheetsLinked: 0,
    tableStats: [],
  });

  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const fetchStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await getStatData();

      if (response.success && response.data?.success) {
        setStats({
          totalTables: response.data.totalTables,
          totalColumns: response.data.totalColumns,
          totalGoogleSheetsLinked: response.data.totalGoogleSheetsLinked,
          tableStats: response.data.tableStats,
        });
      }
    } catch (error) {
      console.error("Error fetching table stats:", error);
    }
    setLoading(false);
  };

  const refreshStats = () => {
    fetchStats();
  };

  const addTableStat = (newTable: TableStat) => {
    setStats((prev) => ({
      totalTables: prev.totalTables + 1,
      totalColumns: prev.totalColumns + newTable.columnCount,
      totalGoogleSheetsLinked:
        prev.totalGoogleSheetsLinked +
        (newTable.sheetConnected == "No" ? 0 : 1),
      tableStats: [...prev.tableStats, newTable],
    }));
  };

  const removeTableStat = (tableId: string) => {
    setStats((prev) => {
      const updatedTables = prev.tableStats.filter(
        (table) => table._id !== tableId
      );
      const removedTable = prev.tableStats.find(
        (table) => table._id === tableId
      );

      return {
        totalTables: prev.totalTables - 1,
        totalColumns: prev.totalColumns - (removedTable?.columnCount || 0),
        totalGoogleSheetsLinked:
          prev.totalGoogleSheetsLinked -
          (removedTable?.sheetConnected == "No" ? 0 : 1),
        tableStats: updatedTables,
      };
    });
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <StatsContext.Provider
      value={{ stats, loading, refreshStats, addTableStat, removeTableStat }}
    >
      {children}
    </StatsContext.Provider>
  );
};

// Hook to use Stats Context
export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};
