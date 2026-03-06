import { queryOptions } from "@tanstack/react-query";

// --- 🛑 PASTE YOUR LINKS HERE 🛑 ---
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx5n1JIjsbiFIYufwnLT1NQojrwEWEAIa_ox3WVVzkuNim6Fpg_hlKmQJhF5OF6dzlP/exec";
const SPREADSHEET_ID = "1rObOhwFNTM3qYmOUbn3kaZ0udn8MLTrnfQFDzwN2PcE";
// -----------------------------------

// 1. THE NEW FETCHER: Talks directly to Google instead of a backend
async function fetchFromGAS(action: string, params: Record<string, string> = {}) {
  const url = new URL(GAS_WEB_APP_URL);
  url.searchParams.append("action", action);
  url.searchParams.append("spreadsheetId", SPREADSHEET_ID);
  
  // --- NEW PASSCODE PROMPT ---
  let pc = sessionStorage.getItem("app_passcode");
  if (!pc) {
    pc = prompt("🔒 Secure Dashboard. Please enter the access passcode:");
    if (pc) sessionStorage.setItem("app_passcode", pc);
  }
  url.searchParams.append("passcode", pc || "");
  // ---------------------------

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.append(key, value);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch from Google Apps Script");
  }
  
  const data = await res.json();
  
  // --- IF PASSCODE IS WRONG ---
  if (data.error === "UNAUTHORIZED") {
    sessionStorage.removeItem("app_passcode");
    alert("Incorrect passcode! Please try again.");
    window.location.reload();
    throw new Error("Unauthorized");
  }
  // ----------------------------

  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

// 2. THE MATH ENGINE: Moved from the backend to the browser
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

function computeSummaryStats(data: Record<string, Record<string, string>[]>) {
  let totalARR = 0;
  
  const getSheet = (name: string) => {
    const key = Object.keys(data).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? data[key] : null;
  };

  const revenueRows = getSheet("Revenue");
  if (revenueRows) {
    for (const r of revenueRows) {
      const status = getField(r, "Status", "status").toLowerCase();
      if (status === "churned") continue;
      const spend = getField(r, "Spend", "spend", "Amount", "amount");
      totalARR += parseSpend(spend);
    }
  }

  const intentRows = getSheet("Intent");
  const uniqueUsers = new Set<string>();
  const uniqueHandraisers = new Set<string>();
  if (intentRows) {
    for (const r of intentRows) {
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

// 3. REACT QUERY ROUTES: Rerouted to use the new fetcher
export const sheetsConfigQuery = queryOptions({
  queryKey: ["sheets", "config"],
  queryFn: () => fetchFromGAS("config"),
});

export function dashboardDataQuery(accountName: string | null) {
  return queryOptions({
    queryKey: ["dashboard", "data", accountName],
    queryFn: async () => {
      const res = await fetchFromGAS("dashboard", accountName ? { account: accountName } : {});
      if (res.data) {
        res.computedSummary = computeSummaryStats(res.data);
      }
      return res;
    },
    retry: false,
    staleTime: 60_000,
  });
}

export const sheetTabsQuery = queryOptions({
  queryKey: ["sheets", "tabs"],
  queryFn: () => fetchFromGAS("tabs"),
  retry: false,
});

export function accountsQuery(searchTerm: string) {
  return queryOptions({
    queryKey: ["accounts", searchTerm],
    queryFn: () => fetchFromGAS("accounts", { q: searchTerm }),
    retry: false,
    staleTime: 30_000,
    enabled: searchTerm.length > 0,
  });
}

export async function configureSpreadsheet(spreadsheetId: string) {
  // Since we hardcoded the ID, we just pretend the save was successful!
  return { connected: true, spreadsheetId: SPREADSHEET_ID };
}

export async function fetchSheetData(sheetName: string) {
  return fetchFromGAS("dashboard"); 
}
