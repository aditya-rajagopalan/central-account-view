import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardDataQuery, sheetsConfigQuery } from "./api";

interface ComputedSummary {
  totalARR: number;
  totalLeads: number;
  handraisers: number;
  prospectingValue: string;
  prospectingSubValue: string;
}

interface DashboardContextType {
  sheetData: Record<string, Record<string, string>[]> | null;
  sheets: string[];
  isLoading: boolean;
  isConnected: boolean;
  isSheetConfigured: boolean;
  error: any;
  computedSummary: ComputedSummary | null;
  accountName: string | null;
  selectedAccount: string | null;
  setSelectedAccount: (name: string | null) => void;
}

const DashboardContext = React.createContext<DashboardContextType>({
  sheetData: null,
  sheets: [],
  isLoading: false,
  isConnected: false,
  isSheetConfigured: false,
  error: null,
  computedSummary: null,
  accountName: null,
  selectedAccount: null,
  setSelectedAccount: () => {},
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(null);
  const configQuery = useQuery(sheetsConfigQuery);
  const isSheetConfigured = !!configQuery.data?.connected;

  const dashboardQueryOpts = dashboardDataQuery(selectedAccount);
  const shouldFetchDashboard = !isSheetConfigured || (isSheetConfigured && !!selectedAccount);
  const { data, isLoading, error } = useQuery({
    ...dashboardQueryOpts,
    enabled: shouldFetchDashboard,
  });

  const value = React.useMemo(() => ({
    sheetData: data?.data || null,
    sheets: data?.sheets || [],
    isLoading,
    isConnected: !!data?.data,
    isSheetConfigured,
    error,
    computedSummary: data?.computedSummary || null,
    accountName: data?.accountName || selectedAccount,
    selectedAccount,
    setSelectedAccount,
  }), [data, isLoading, error, selectedAccount, isSheetConfigured]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

function findSheet(data: Record<string, any>, name: string): Record<string, string>[] | null {
  if (data[name]) return data[name];
  const lowerName = name.toLowerCase();
  const key = Object.keys(data).find(k => k.toLowerCase() === lowerName);
  return key ? data[key] : null;
}

export function useDashboardData() {
  return React.useContext(DashboardContext);
}

export function useSheetData(sheetName: string): Record<string, string>[] | null {
  const { sheetData } = useDashboardData();
  if (!sheetData) return null;

  const rows = findSheet(sheetData, sheetName);
  return rows || null;
}
