import { getSheetData, getSheetNames } from "./googleSheets";

let configuredSpreadsheetId: string | null = null;
let accountListCache: { data: Record<string, string>[]; timestamp: number } | null = null;
const CACHE_TTL = 60_000;

export function setSpreadsheetId(id: string) {
  configuredSpreadsheetId = id;
  accountListCache = null;
}

export function getSpreadsheetId(): string | null {
  return configuredSpreadsheetId;
}

function parseRows(rows: any[][]): Record<string, string>[] {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map((h: string) => String(h).trim());
  return rows.slice(1).map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] != null ? String(row[i]).trim() : "";
    });
    return obj;
  });
}

function parseSpend(spend: string): number {
  if (!spend) return 0;
  const cleaned = spend.replace(/[,$]/g, "").trim();
  const match = cleaned.match(/^([\d.]+)\s*\/?\s*(yr|mo|year|month)?/i);
  if (!match) return 0;
  const amount = parseFloat(match[1]);
  if (isNaN(amount)) return 0;
  const period = (match[2] || "yr").toLowerCase();
  if (period === "mo" || period === "month") return amount * 12;
  return amount;
}

function getField(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== "") return row[k];
  }
  return "";
}

function filterByAccount(rows: Record<string, string>[], accountName: string | null): Record<string, string>[] {
  if (!accountName) return rows;
  return rows.filter(r => {
    const rowAccount = getField(r, "Account Name", "account_name");
    return rowAccount === "" || rowAccount.toLowerCase() === accountName.toLowerCase();
  });
}

function findSheet(data: Record<string, Record<string, string>[]>, name: string): Record<string, string>[] | null {
  if (data[name]) return data[name];
  const lowerName = name.toLowerCase();
  const key = Object.keys(data).find(k => k.toLowerCase() === lowerName);
  return key ? data[key] : null;
}

export function computeSummaryStats(data: Record<string, Record<string, string>[]>, accountName: string | null): {
  totalARR: number;
  totalLeads: number;
  handraisers: number;
  prospectingValue: string;
  prospectingSubValue: string;
} {
  let totalARR = 0;
  const revenueRows = findSheet(data, "Revenue");
  if (revenueRows) {
    for (const r of filterByAccount(revenueRows, accountName)) {
      const status = getField(r, "Status", "status").toLowerCase();
      if (status === "churned") continue;
      const spend = getField(r, "Spend", "spend", "Amount", "amount");
      totalARR += parseSpend(spend);
    }
  }

  const intentRows = findSheet(data, "Intent");
  const uniqueUsers = new Set<string>();
  const uniqueHandraisers = new Set<string>();
  if (intentRows) {
    for (const r of filterByAccount(intentRows, accountName)) {
      const userId = getField(r, "User ID", "user_id", "ID", "id", "Name", "name");
      if (userId) uniqueUsers.add(userId);
      const intentType = getField(r, "Intent Type", "intent_type").toLowerCase();
      if (intentType === "handraiser" && userId) uniqueHandraisers.add(userId);
    }
  }

  const totalLeads = uniqueUsers.size;
  const handraisers = uniqueHandraisers.size;

  let prospectingValue = "Low";
  let prospectingSubValue = "Standard Account";
  if (handraisers >= 2 && totalARR >= 10000) {
    prospectingValue = "High";
    prospectingSubValue = "Top 5% of Portfolio";
  } else if (handraisers >= 1 || totalARR >= 5000) {
    prospectingValue = "Medium";
    prospectingSubValue = "Active Engagement";
  }

  return { totalARR, totalLeads, handraisers, prospectingValue, prospectingSubValue };
}

export async function getAccountList(searchQuery?: string): Promise<{
  accounts: Record<string, string>[];
  total: number;
}> {
  if (!configuredSpreadsheetId) throw new Error("Spreadsheet ID not configured");

  if (!accountListCache || Date.now() - accountListCache.timestamp > CACHE_TTL) {
    try {
      const rows = await getSheetData(configuredSpreadsheetId, "Account");
      accountListCache = { data: parseRows(rows), timestamp: Date.now() };
    } catch (e: any) {
      accountListCache = null;
      throw e;
    }
  }

  let accounts = accountListCache.data;
  const total = accounts.length;

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    accounts = accounts.filter(r => {
      const name = getField(r, "Account Name", "account_name").toLowerCase();
      const bdr = getField(r, "BDR", "bdr").toLowerCase();
      const ae = getField(r, "AE", "ae").toLowerCase();
      const segment = getField(r, "Segment", "segment").toLowerCase();
      const category = getField(r, "Category", "category").toLowerCase();
      return name.includes(q) || bdr.includes(q) || ae.includes(q) || segment.includes(q) || category.includes(q);
    });
  }

  const lightweight = accounts.slice(0, 20).map(r => ({
    "Account Name": getField(r, "Account Name", "account_name"),
    "Category": getField(r, "Category", "category"),
    "BDR": getField(r, "BDR", "bdr"),
    "AE": getField(r, "AE", "ae"),
    "Segment": getField(r, "Segment", "segment"),
  }));

  return { accounts: lightweight, total: accounts.length };
}

export async function getAvailableSheets(): Promise<string[]> {
  if (!configuredSpreadsheetId) throw new Error("Spreadsheet ID not configured");
  return getSheetNames(configuredSpreadsheetId);
}

export async function getRawSheetData(sheetName: string): Promise<Record<string, string>[]> {
  if (!configuredSpreadsheetId) throw new Error("Spreadsheet ID not configured");
  const rows = await getSheetData(configuredSpreadsheetId, sheetName);
  return parseRows(rows);
}

export async function getDashboardData(accountName?: string): Promise<any> {
  if (!configuredSpreadsheetId) throw new Error("Spreadsheet ID not configured");

  const sheetNames = await getSheetNames(configuredSpreadsheetId);
  const data: Record<string, Record<string, string>[]> = {};

  for (const name of sheetNames) {
    try {
      const rows = await getSheetData(configuredSpreadsheetId, name);
      data[name] = parseRows(rows);
    } catch (e) {
      data[name] = [];
    }
  }

  const resolvedAccount = accountName || (() => {
    const accountSheet = findSheet(data, "Account");
    if (accountSheet && accountSheet.length > 0) {
      return getField(accountSheet[0], "Account Name", "account_name") || null;
    }
    return null;
  })();

  const filteredData: Record<string, Record<string, string>[]> = {};
  for (const [name, rows] of Object.entries(data)) {
    filteredData[name] = filterByAccount(rows, resolvedAccount);
  }

  const computedSummary = computeSummaryStats(filteredData, resolvedAccount);

  return {
    sheets: sheetNames,
    data: filteredData,
    computedSummary,
    accountName: resolvedAccount,
  };
}
