import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings, Link, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, RefreshCw, XCircle } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { sheetsConfigQuery, sheetTabsQuery, configureSpreadsheet } from "@/lib/api";

export default function SheetSettings() {
  const [url, setUrl] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const configQuery = useQuery(sheetsConfigQuery);
  const tabsQuery = useQuery({
    ...sheetTabsQuery,
    enabled: !!configQuery.data?.connected,
  });

  const connectMutation = useMutation({
    mutationFn: configureSpreadsheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setUrl("");
    },
  });

  const isConnected = configQuery.data?.connected;
  const tabsError = tabsQuery.error as any;
  const tabsErrorMessage = tabsError?.error || tabsError?.message || "";

  return (
    <Card className={`border shadow-sm overflow-hidden transition-all ${isConnected ? "border-emerald-200 bg-emerald-50/30" : "border-amber-200 bg-amber-50/30"}`}>
      <CardHeader
        className="pb-3 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-sm font-black flex items-center justify-between w-full text-slate-800 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-500" />
            Data Source
          </div>
          <div className="flex items-center gap-2">
            {isConnected && !tabsQuery.isError ? (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[9px] font-bold uppercase tracking-tight" data-testid="badge-sheet-connected">
                <CheckCircle className="w-3 h-3 mr-1" />
                Google Sheets Connected
              </Badge>
            ) : isConnected && tabsQuery.isError ? (
              <Badge className="bg-red-100 text-red-700 border-red-200 text-[9px] font-bold uppercase tracking-tight" data-testid="badge-sheet-error">
                <XCircle className="w-3 h-3 mr-1" />
                Connection Error
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[9px] font-bold uppercase tracking-tight" data-testid="badge-sheet-disconnected">
                <AlertCircle className="w-3 h-3 mr-1" />
                Using Mock Data
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0 pb-4 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
              Google Sheet URL or Spreadsheet ID
            </label>
            <div className="flex gap-2">
              <Input
                data-testid="input-spreadsheet-url"
                placeholder="Paste your Google Sheets URL or ID here..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="text-xs bg-white"
              />
              <button
                data-testid="button-connect-sheet"
                onClick={() => url.trim() && connectMutation.mutate(url.trim())}
                disabled={!url.trim() || connectMutation.isPending}
                className="px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
              >
                {connectMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Link className="w-3 h-3" />
                )}
                Connect
              </button>
            </div>
            {connectMutation.isError && (
              <p className="text-[10px] text-red-600 font-medium">Failed to connect. Check the URL and try again.</p>
            )}
          </div>

          {isConnected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Connected Sheet ID
                  </span>
                </div>
                <button
                  data-testid="button-refresh-data"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ["sheets"] });
                    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
                    queryClient.invalidateQueries({ queryKey: ["accounts"] });
                  }}
                  className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
              <code className="text-[10px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-100 block truncate">
                {configQuery.data?.spreadsheetId}
              </code>

              {tabsQuery.isError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1" data-testid="error-sheet-access">
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="text-[11px] font-bold text-red-700">Could not read spreadsheet</span>
                  </div>
                  <p className="text-[10px] text-red-600 leading-relaxed">
                    {tabsErrorMessage || "Unknown error. Try refreshing or reconnecting."}
                  </p>
                  <p className="text-[10px] text-red-400 leading-relaxed">
                    Make sure the Google Sheet is shared with the Google account connected to this project, and that it is a native Google Sheets file (not an uploaded Excel/CSV).
                  </p>
                </div>
              )}

              {tabsQuery.isLoading && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading sheet tabs...
                </div>
              )}

              {tabsQuery.data?.sheets && (
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Detected Tabs ({tabsQuery.data.sheets.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tabsQuery.data.sheets.map((tab: string) => (
                      <Badge key={tab} variant="outline" className="text-[9px] font-bold border-slate-200 text-slate-500 bg-white">
                        {tab}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
