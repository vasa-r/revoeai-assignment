import { TableData } from "@/types/types";
import { useState, useEffect } from "react";

type IncomingRow = {
  [key: string]: string;
};

const WS_URL = process.env.NEXT_PUBLIC_API_WS_URL!;

export default function useWebSocket(
  setData: React.Dispatch<React.SetStateAction<TableData | null>>,
  tableId: string,
  isSheetConnected: boolean
) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<"connected" | "disconnected">(
    "disconnected"
  );

  useEffect(() => {
    if (!isSheetConnected) {
      return; // Do not connect WebSocket if sheet is not connected
    }

    let reconnectTimeout: NodeJS.Timeout;
    const connectWebSocket = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }

      const socketUrl = `${WS_URL}?token=${token}&tableId=${tableId}`;

      const socket = new WebSocket(socketUrl);
      setWs(socket);

      socket.onopen = () => {
        console.log("WebSocket connected");
        setWsStatus("connected");
      };

      socket.onmessage = (event) => {
        try {
          const incomingData = JSON.parse(event.data);

          setData((prevTable) => {
            if (!prevTable) return prevTable;

            const newRows = incomingData.data;
            if (newRows.length === 0) return prevTable;

            const fieldNames = Object.keys(newRows[0]);
            const columnCount = Math.min(
              fieldNames.length,
              prevTable.columns.length
            );

            const updatedColumns = prevTable.columns.map((column, index) => {
              if (index >= columnCount) return column;

              return {
                ...column,
                rows: newRows.map((row: IncomingRow) => ({
                  value: row[fieldNames[index]] ?? "",
                  createdAt: new Date().toISOString(),
                })),
              };
            });

            return {
              ...prevTable,
              columns: updatedColumns,
            };
          });
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected, reconnecting...");
        setWsStatus("disconnected");

        // Reconnect after 3 seconds
        reconnectTimeout = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [isSheetConnected]);

  return { wsStatus };
}
