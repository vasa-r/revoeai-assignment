import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const fetchGoogleSheetData = async (spreadsheetId: string) => {
  try {
    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();
    const headers = sheet.headerValues;
    const data = rows.map((row) =>
      headers.reduce((acc, header) => {
        acc[header] = row.get(header) || "";
        return acc;
      }, {} as Record<string, string>)
    );

    return { headers, data };
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);
    throw new Error("Failed to fetch data from Google Sheets");
  }
};

export default fetchGoogleSheetData;
