import WebSocket from "ws";
import fetchGoogleSheetData from "../services/google-services";
import { getTableById } from "../lib/get-table";
import { verifyUser } from "../lib/utils";

interface Client {
  ws: WebSocket;
  spreadsheetId: string;
  lastKnownData?: any;
}

const clients: Record<string, Client> = {};

export const setupWebSocketServer = (server: any) => {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", async (ws, req) => {
    console.log("WebSocket connection established");

    const url = new URL(req.url!, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");
    const tableId = url.searchParams.get("tableId");

    if (!token || !tableId) {
      ws.close();
      console.log("Missing token or tableId in the URL");
      return;
    }

    let userId;
    try {
      const decoded = verifyUser(token);
      userId = decoded.userId;
    } catch (error) {
      ws.close();
      console.error("Invalid or expired token:", error);
      return;
    }

    console.log(
      `WebSocket connection established for UserId: ${userId}, TableId: ${tableId}`
    );

    try {
      const table = await getTableById(tableId);
      if (!table) {
        ws.close();
        console.log(`No table found with tableId: ${tableId}`);
        return;
      }

      const spreadsheetId = table.googleSheetId;
      clients[userId] = { ws, spreadsheetId };
      const { data } = await fetchGoogleSheetData(spreadsheetId);
      clients[userId].lastKnownData = data;
    } catch (error) {
      console.error("Error loading initial sheet data:", error);
    }

    ws.on("close", () => {
      delete clients[userId];
      console.log(`WebSocket disconnected for User: ${userId}`);
    });
  });

  setInterval(async () => {
    for (const userId in clients) {
      const { ws, spreadsheetId, lastKnownData } = clients[userId];

      try {
        const { data } = await fetchGoogleSheetData(spreadsheetId);

        if (JSON.stringify(data) !== JSON.stringify(lastKnownData)) {
          console.log(`Table updated for User ${userId}`);

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ data }));
          }

          clients[userId].lastKnownData = data;
        }
      } catch (error) {
        console.error(`Error monitoring sheet for User ${userId}:`, error);
      }
    }
  }, 5000);

  return wss;
};
