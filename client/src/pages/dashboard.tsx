import * as React from "react";
import Header from "@/components/dashboard/header";
import SummaryStats from "@/components/dashboard/summary-stats";
import AccountPotential from "@/components/dashboard/account-potential";
import OngoingDiscussions from "@/components/dashboard/ongoing-discussions";
import TopPersonas from "@/components/dashboard/top-personas";
import RevenueHealth from "@/components/dashboard/revenue-health";
import TeamEngagement from "@/components/dashboard/team-engagement";
import SheetSettings from "@/components/dashboard/sheet-settings";
import AccountSelector from "@/components/dashboard/account-selector";
import { DashboardProvider, useDashboardData } from "@/lib/dashboard-context";
import { Search, Loader2 } from "lucide-react";

function DashboardContent() {
  const { selectedAccount, isSheetConfigured, isLoading, error } = useDashboardData();

  const showSearchPrompt = isSheetConfigured && !selectedAccount;
  const showLoadingState = isSheetConfigured && selectedAccount && isLoading;
  const showErrorState = isSheetConfigured && selectedAccount && error && !isLoading;

  if (showSearchPrompt) {
    return (
      <div className="max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6 flex-1 flex flex-col">
        <SheetSettings />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Search for an Account</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Use the search bar above to find an account. Start typing an account name, BDR name, or segment to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showLoadingState) {
    return (
      <div className="max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6 flex-1 flex flex-col">
        <SheetSettings />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading {selectedAccount} data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showErrorState) {
    return (
      <div className="max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6 flex-1 flex flex-col">
        <SheetSettings />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-red-300" />
            </div>
            <p className="text-sm font-medium text-slate-700">Could not load data for "{selectedAccount}"</p>
            <p className="text-xs text-red-400 max-w-sm leading-relaxed">{(error as any)?.error || (error as any)?.message || "Check the Data Source settings or try a different account."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6 flex-1 flex flex-col">
      <SheetSettings />
      <Header />
      <SummaryStats />
      <AccountPotential />
      <OngoingDiscussions />
      <TopPersonas />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <RevenueHealth />
        <TeamEngagement />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardInner />
    </DashboardProvider>
  );
}

function DashboardInner() {
  const { selectedAccount, setSelectedAccount, isSheetConfigured } = useDashboardData();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md z-50 relative">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">BS</span>
          </div>
          Unified Account Command Center
        </div>
        <AccountSelector
          selectedAccount={selectedAccount}
          onSelectAccount={setSelectedAccount}
          isSheetConnected={isSheetConfigured}
        />
      </div>

      <DashboardContent />
    </div>
  );
}
