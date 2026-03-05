import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, UserCircle, ExternalLink } from "lucide-react";
import { useSheetData } from "@/lib/dashboard-context";

const MOCK = {
  accountName: "Acme Corp",
  sfdcUrl: "https://salesforce.com/accounts/acme-corp",
  category: "Farming",
  bdr: "Sarah Jenkins",
  ae: "Michael Chen",
  segment: "Enterprise Field",
};

export default function Header() {
  const sheetRows = useSheetData("Account");
  const row = sheetRows?.[0];

  const d = row ? {
    accountName: row["Account Name"] || row["account_name"] || MOCK.accountName,
    sfdcUrl: row["SFDC URL"] || row["sfdc_url"] || MOCK.sfdcUrl,
    category: row["Category"] || row["category"] || MOCK.category,
    bdr: row["BDR"] || row["bdr"] || MOCK.bdr,
    ae: row["AE"] || row["ae"] || MOCK.ae,
    segment: row["Segment"] || row["segment"] || MOCK.segment,
  } : MOCK;

  return (
    <header className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.open(d.sfdcUrl, "_blank")}>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 hover:text-primary transition-colors" data-testid="text-account-name">{d.accountName}</h1>
            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none px-3" data-testid="badge-account-category">
            {d.category}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 mt-1">
          <div className="flex items-center gap-1.5">
            <UserCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 uppercase tracking-tight">BDR:</span>
            <span className="text-slate-900 font-bold" data-testid="text-bdr-owner">{d.bdr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UserCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 uppercase tracking-tight">AE:</span>
            <span className="text-slate-900 font-bold" data-testid="text-ae-owner">{d.ae}</span>
          </div>
          <div className="flex items-center gap-1.5 border-l pl-6 border-slate-200 ml-2">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 uppercase tracking-tight">Segment:</span>
            <span className="text-slate-900 font-bold" data-testid="text-account-segment">{d.segment}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
