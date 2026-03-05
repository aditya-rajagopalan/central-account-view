import { queryOptions } from "@tanstack/react-query";

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { status: res.status, ...body };
  }
  return res.json();
}

async function postJSON(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw { status: res.status, ...data };
  }
  return res.json();
}

export const sheetsConfigQuery = queryOptions({
  queryKey: ["sheets", "config"],
  queryFn: () => fetchJSON("/api/sheets/config"),
});

export function dashboardDataQuery(accountName: string | null) {
  return queryOptions({
    queryKey: ["dashboard", "data", accountName],
    queryFn: () => fetchJSON(accountName ? `/api/dashboard?account=${encodeURIComponent(accountName)}` : "/api/dashboard"),
    retry: false,
    staleTime: 60_000,
  });
}

export const sheetTabsQuery = queryOptions({
  queryKey: ["sheets", "tabs"],
  queryFn: () => fetchJSON("/api/sheets/tabs"),
  retry: false,
});

export function accountsQuery(searchTerm: string) {
  return queryOptions({
    queryKey: ["accounts", searchTerm],
    queryFn: () => fetchJSON(`/api/accounts?q=${encodeURIComponent(searchTerm)}`),
    retry: false,
    staleTime: 30_000,
    enabled: searchTerm.length > 0,
  });
}

export async function configureSpreadsheet(spreadsheetId: string) {
  return postJSON("/api/sheets/config", { spreadsheetId });
}

export async function fetchSheetData(sheetName: string) {
  return fetchJSON(`/api/sheets/data/${encodeURIComponent(sheetName)}`);
}
