import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, UserCircle, Briefcase, ChevronDown, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { accountsQuery } from "@/lib/api";

interface AccountSelectorProps {
  selectedAccount: string | null;
  onSelectAccount: (name: string) => void;
  isSheetConnected: boolean;
}

export default function AccountSelector({ selectedAccount, onSelectAccount, isSheetConnected }: AccountSelectorProps) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading, error: accountsError } = useQuery({
    ...accountsQuery(debouncedSearch),
    enabled: isSheetConnected && debouncedSearch.length > 0,
  });

  const errorMessage = (accountsError as any)?.error || (accountsError as any)?.message || "";

  const handleSelect = (name: string) => {
    onSelectAccount(name);
    setSearch("");
    setDebouncedSearch("");
    setIsOpen(false);
  };

  if (!isSheetConnected) {
    return (
      <div className="text-xs text-slate-400 font-medium">
        SDR/BDR Workspace
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" data-testid="account-selector">
      {selectedAccount && !isOpen ? (
        <button
          data-testid="button-change-account"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm max-w-[400px] border border-white/10"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-white font-bold truncate">{selectedAccount}</span>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              data-testid="input-account-search"
              type="text"
              autoFocus
              placeholder="Search accounts by name, BDR, segment..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-[340px] h-9 pl-9 pr-8 rounded-lg bg-white/15 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            {(search || selectedAccount) && (
              <button
                data-testid="button-clear-search"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setIsOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isLoading && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
        </div>
      )}

      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 w-[440px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          style={{ zIndex: 9999 }}
          data-testid="account-dropdown"
        >
          {debouncedSearch.length === 0 ? (
            <div className="p-6 text-center">
              <Search className="w-6 h-6 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-400">Type to search across accounts</p>
              <p className="text-[10px] text-slate-300 mt-1">Search by account name, BDR, AE, or segment</p>
            </div>
          ) : isLoading ? (
            <div className="p-6 flex items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-medium">Searching accounts...</span>
            </div>
          ) : accountsError ? (
            <div className="p-5 text-center space-y-1">
              <p className="text-xs font-bold text-red-600">Could not search accounts</p>
              <p className="text-[10px] text-red-400 leading-relaxed">{errorMessage || "Check the Data Source settings and try again."}</p>
            </div>
          ) : data?.accounts?.length > 0 ? (
            <>
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Showing {data.accounts.length} of {data.total} accounts
                </span>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {data.accounts.map((account: Record<string, string>, idx: number) => (
                  <button
                    key={account["Account Name"] || idx}
                    data-testid={`account-option-${idx}`}
                    onClick={() => handleSelect(account["Account Name"])}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {account["Account Name"]}
                      </span>
                      {account["Category"] && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-bold uppercase tracking-tight h-4 px-1.5">
                          {account["Category"]}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
                      {account["BDR"] && (
                        <div className="flex items-center gap-1">
                          <UserCircle className="w-3 h-3 text-slate-300" />
                          <span className="text-slate-400">BDR:</span>
                          <span className="font-bold text-slate-600">{account["BDR"]}</span>
                        </div>
                      )}
                      {account["AE"] && (
                        <div className="flex items-center gap-1">
                          <UserCircle className="w-3 h-3 text-slate-300" />
                          <span className="text-slate-400">AE:</span>
                          <span className="font-bold text-slate-600">{account["AE"]}</span>
                        </div>
                      )}
                      {account["Segment"] && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-300" />
                          <span className="font-bold text-slate-600">{account["Segment"]}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-6 h-6 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-400">No accounts match "{debouncedSearch}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
