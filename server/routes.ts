import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setSpreadsheetId, getSpreadsheetId, getDashboardData, getAvailableSheets, getRawSheetData, getAccountList } from "./sheetDataService";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/sheets/config", (_req, res) => {
    const id = getSpreadsheetId();
    res.json({ spreadsheetId: id, connected: !!id });
  });

  app.post("/api/sheets/config", (req, res) => {
    const { spreadsheetId } = req.body;
    if (!spreadsheetId || typeof spreadsheetId !== "string") {
      return res.status(400).json({ error: "spreadsheetId is required" });
    }
    let cleanId = spreadsheetId.trim();
    const match = cleanId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      cleanId = match[1];
    }
    setSpreadsheetId(cleanId);
    res.json({ spreadsheetId: cleanId, connected: true });
  });

  app.get("/api/sheets/tabs", async (_req, res) => {
    try {
      const sheets = await getAvailableSheets();
      res.json({ sheets });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/sheets/data/:sheetName", async (req, res) => {
    try {
      const data = await getRawSheetData(req.params.sheetName);
      res.json({ data });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/accounts", async (req, res) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q : undefined;
      const result = await getAccountList(q);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/dashboard", async (req, res) => {
    try {
      const account = typeof req.query.account === "string" ? req.query.account : undefined;
      const data = await getDashboardData(account);
      res.json(data);
    } catch (e: any) {
      res.status(400).json({ error: e.message, fallback: true });
    }
  });

  return httpServer;
}
