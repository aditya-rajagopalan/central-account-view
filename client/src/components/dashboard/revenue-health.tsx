import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, PlayCircle, Calendar, Users } from "lucide-react";
import { useSheetData } from "@/lib/dashboard-context";

const MOCK_PAID_GROUPS = [
  {
    id: "GID-8821", name: "Core Platform", userCount: 156,
    products: [
      { name: "Automate", spend: "$12,000/yr", status: "Active", renewal: "Oct 12, 2024", term: "Annual" },
      { name: "App Live", spend: "$450/mo", status: "Active", renewal: "Apr 01, 2024", term: "Monthly" }
    ],
    activeTrials: ["Percy (Expiring in 4d)"],
    completedTrials: ["Visual Testing (Feb 2024)"]
  },
  {
    id: "GID-4402", name: "Mobile App", userCount: 42,
    products: [
      { name: "App Live", spend: "$8,200/yr", status: "Active", renewal: "Jan 20, 2025", term: "Annual" }
    ],
    activeTrials: ["Automate (Started Today)"],
    completedTrials: ["App Automate (Dec 2023)"]
  },
  {
    id: "GID-1105", name: "Legacy QA", userCount: 12,
    products: [
      { name: "Automate", spend: "$0", status: "Churned", renewal: "Expired", term: "Annual" }
    ],
    activeTrials: [],
    completedTrials: ["Percy (Jan 2024)", "Accessibility Testing (Nov 2023)"]
  }
];

const MOCK_FREE_LEADS = [
  { id: "L-9910", name: "Casey Lee", trials: ["Automate", "App Live"], status: "Active Trial" },
  { id: "L-7721", name: "Jordan Smith", trials: ["Percy"], status: "Trial Expired" }
];

export default function RevenueHealth() {
  const revenueRows = useSheetData("Revenue");
  const freeRows = useSheetData("Free Trials");

  const paidGroups = React.useMemo(() => {
    if (!revenueRows || revenueRows.length === 0) return MOCK_PAID_GROUPS;

    const groupMap = new Map<string, any>();
    for (const r of revenueRows) {
      const gid = r["Group ID"] || r["group_id"] || r["GroupID"] || "";
      if (!gid) continue;
      if (!groupMap.has(gid)) {
        groupMap.set(gid, {
          id: gid,
          name: r["Group Name"] || r["group_name"] || r["Team"] || gid,
          userCount: parseInt(r["User Count"] || r["user_count"] || "0"),
          products: [],
          activeTrials: [],
          completedTrials: [],
        });
      }
      const group = groupMap.get(gid)!;
      const productName = r["Product"] || r["product"] || "";
      if (productName) {
        group.products.push({
          name: productName,
          spend: r["Spend"] || r["spend"] || r["Amount"] || "$0",
          status: r["Status"] || r["status"] || "Active",
          renewal: r["Renewal"] || r["renewal"] || r["Renewal Date"] || "",
          term: r["Term"] || r["term"] || "Annual",
        });
      }
      const activeTrial = r["Active Trial"] || r["active_trial"] || "";
      if (activeTrial) group.activeTrials.push(activeTrial);
      const completedTrial = r["Completed Trial"] || r["completed_trial"] || "";
      if (completedTrial) group.completedTrials.push(completedTrial);
    }
    return Array.from(groupMap.values());
  }, [revenueRows]);

  const freeLeads = React.useMemo(() => {
    if (!freeRows || freeRows.length === 0) return MOCK_FREE_LEADS;
    return freeRows.map(r => ({
      id: r["ID"] || r["id"] || r["Lead ID"] || "",
      name: r["Name"] || r["name"] || "",
      trials: (r["Trials"] || r["trials"] || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      status: r["Status"] || r["status"] || "Active Trial",
    }));
  }, [freeRows]);

  return (
    <Card className="h-full flex flex-col shadow-sm border-slate-200 overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wider">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          Current Revenue
        </CardTitle>
      </CardHeader>

      <Tabs defaultValue="paid" className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-3 shrink-0">
          <TabsList className="grid grid-cols-2 h-8 bg-slate-100/50 p-1">
            <TabsTrigger value="paid" className="text-[10px] font-bold uppercase tracking-tight">Paid Teams</TabsTrigger>
            <TabsTrigger value="free" className="text-[10px] font-bold uppercase tracking-tight">Free Trials</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="paid" className="flex-1 overflow-auto p-0 m-0 outline-none">
          <div className="p-4 space-y-6">
            {paidGroups.map((group) => (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{group.name}</span>
                    <Badge variant="outline" className="text-[9px] h-4 border-slate-200 text-slate-400 font-bold">{group.id}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{group.userCount} Users</span>
                  </div>
                </div>

                <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                  <Table>
                    <TableBody>
                      {group.products.map((p: any) => (
                        <TableRow key={p.name} className="hover:bg-transparent border-b last:border-0">
                          <TableCell className="py-3 px-3">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-slate-700">{p.name}</span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 border-slate-100 text-slate-500 font-medium">
                                  {p.term}
                                </Badge>
                                <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-2.5 h-2.5" />
                                  {p.renewal}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 px-3">
                            <div className="flex flex-col items-end">
                              <span className="text-[11px] font-mono font-bold text-emerald-600">{p.spend}</span>
                              <div className="mt-1">
                                {p.status === "Churned" ? (
                                  <Badge className="bg-red-50 text-red-600 border-red-100 text-[8px] font-black uppercase">Churned</Badge>
                                ) : (
                                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] font-black uppercase tracking-tighter">Paid</Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {(group.activeTrials.length > 0 || group.completedTrials.length > 0) && (
                  <div className="space-y-2 bg-slate-50/50 border border-slate-100 p-2.5 rounded-lg">
                    {group.activeTrials.length > 0 && (
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-tight shrink-0">Active Trial:</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {group.activeTrials.map((t: string) => (
                            <span key={t} className="text-[10px] text-primary/70 font-medium">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {group.completedTrials.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight shrink-0">Recent Trials (1Y):</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {group.completedTrials.map((t: string) => (
                            <span key={t} className="text-[10px] text-slate-400 font-medium">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="free" className="flex-1 overflow-auto p-0 m-0 outline-none">
          <div className="p-4 space-y-4">
            {freeLeads.map((lead) => (
              <div key={lead.id} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                    <span className="text-[9px] text-slate-400 font-mono">{lead.id}</span>
                  </div>
                  <Badge variant={lead.status === "Active Trial" ? "default" : "secondary"} className="text-[8px] uppercase tracking-tighter font-black h-4 px-1.5">
                    {lead.status}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Explored Trials</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {lead.trials.map((t: string) => (
                      <Badge key={t} className="bg-blue-50 text-primary border-blue-100 text-[9px] font-bold">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
