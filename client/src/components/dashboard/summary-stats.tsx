import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Zap, AlertCircle } from "lucide-react";
import { useSheetData, useDashboardData } from "@/lib/dashboard-context";

const MOCK_STATS = [
  { label: "Prospecting Value", value: "High", subValue: "Top 5% of Portfolio" },
  { label: "Total Account ARR", value: "$24,650", subValue: "Current Portfolio" },
  { label: "Total Leads", value: "12", subValue: "In last 3 months" },
  { label: "Handraisers", value: "2", subValue: "In last 3 months" },
];

const MOCK_SUMMARY = "High-growth account with 2 active handraisers in the Core Platform team. Recent trials in Automate suggest an imminent expansion opportunity. Annual contract value is healthy but undermined by a $0 churned GID that could be reclaimed via a targeted \"Masterclass\" follow-up.";

const ICONS = [Target, TrendingUp, Zap, AlertCircle];
const COLORS = [
  { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
];

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return "$" + amount.toLocaleString("en-US");
  }
  return "$" + amount;
}

export default function SummaryStats() {
  const sheetRows = useSheetData("Summary");
  const { computedSummary } = useDashboardData();

  const stats = React.useMemo(() => {
    const sheetHasValues = sheetRows && sheetRows.length > 0;

    const getSheetValue = (label: string): { value: string; subValue: string } | null => {
      if (!sheetHasValues) return null;
      const row = sheetRows!.find(r => {
        const l = (r["Label"] || r["label"] || "").toLowerCase();
        return l === label.toLowerCase();
      });
      if (!row) return null;
      const val = row["Value"] || row["value"] || "";
      if (!val) return null;
      return {
        value: val,
        subValue: row["Sub Value"] || row["sub_value"] || row["SubValue"] || "",
      };
    };

    const prospecting = getSheetValue("Prospecting Value");
    const arr = getSheetValue("Total Account ARR");
    const leads = getSheetValue("Total Leads");
    const handraisers = getSheetValue("Handraisers");

    return [
      {
        label: "Prospecting Value",
        value: prospecting?.value || computedSummary?.prospectingValue || MOCK_STATS[0].value,
        subValue: prospecting?.subValue || computedSummary?.prospectingSubValue || MOCK_STATS[0].subValue,
      },
      {
        label: "Total Account ARR",
        value: arr?.value || (computedSummary ? formatCurrency(computedSummary.totalARR) : MOCK_STATS[1].value),
        subValue: arr?.subValue || MOCK_STATS[1].subValue,
      },
      {
        label: "Total Leads",
        value: leads?.value || (computedSummary ? String(computedSummary.totalLeads) : MOCK_STATS[2].value),
        subValue: leads?.subValue || MOCK_STATS[2].subValue,
      },
      {
        label: "Handraisers",
        value: handraisers?.value || (computedSummary ? String(computedSummary.handraisers) : MOCK_STATS[3].value),
        subValue: handraisers?.subValue || MOCK_STATS[3].subValue,
      },
    ];
  }, [sheetRows, computedSummary]);

  const summaryText = React.useMemo(() => {
    if (sheetRows && sheetRows.length > 0) {
      const summaryRow = sheetRows.find(r => r["Summary"] || r["summary"]);
      if (summaryRow) {
        const text = summaryRow["Summary"] || summaryRow["summary"];
        if (text) return text;
      }
    }
    return MOCK_SUMMARY;
  }, [sheetRows]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const style = COLORS[i] || COLORS[0];
        const Icon = ICONS[i] || Target;
        return (
          <Card key={stat.label} className={`border ${style.border} shadow-sm overflow-hidden`}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${style.bg}`}>
                <Icon className={`w-5 h-5 ${style.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-slate-900 leading-none">{stat.value}</span>
                  <span className={`text-[10px] font-bold ${style.color}`}>{stat.subValue}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card className="lg:col-span-4 border-slate-200 bg-slate-900 text-white shadow-lg">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Account Summary & Strategic Importance</h3>
              <p className="text-xs text-slate-400 max-w-2xl">
                {summaryText.split(/(\d+ active handraisers?)/).map((part, i) =>
                  /\d+ active handraisers?/.test(part)
                    ? <span key={i} className="text-primary font-bold">{part}</span>
                    : part
                )}
              </p>
            </div>
          </div>
          <Badge className="bg-primary text-white border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
            Priority 1 Account
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
