import { TableData } from "@/types/types";
import { useState, useEffect } from "react";

type IncomingRow = {
  [key: string]: string;
};

const WS_URL = process.env.NEXT_PUBLIC_API_WS_URL!;

export default function useWebSocket(
  setData: React.Dispatch<React.SetStateAction<TableData | null>>
) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<"connected" | "disconnected">(
    "disconnected"
  );

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    const connectWebSocket = () => {
      const socket = new WebSocket(WS_URL);
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

            const updatedColumns = prevTable.columns.map((column) => ({
              ...column,
              rows: newRows.map((row: IncomingRow) => ({
                value: row[column.columnName] ?? "",
                createdAt: new Date().toISOString(),
              })),
            }));

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
  }, []);

  return { wsStatus };
}
