import WebSocket from "ws";
import fetchGoogleSheetData from "../services/google-services";

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

    const userId = "vasa";
    const spreadsheetId = "1WWMRMN10yWsdeiKtoqLG7CtCw0FRcHEeWj71WH5aXkE";

    clients[userId] = { ws, spreadsheetId };

    try {
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
