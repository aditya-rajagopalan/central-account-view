import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ExternalLink, Briefcase, Users, AlertTriangle, History } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSheetData } from "@/lib/dashboard-context";

const MOCK_DISCUSSIONS = {
  openOpportunities: [
    { name: "Enterprise Expansion - Mobile App Team", groupId: "GID-8821", amount: "$45,000", link: "https://salesforce.com/opp/1", status: "Negotiation" },
    { name: "Percy - Cross-Platform Automation", groupId: "GID-4402", amount: "$28,000", link: "https://salesforce.com/opp/2", status: "Discovery" }
  ],
  recentOpportunities: [
    { name: "App Automate - Security Testing", groupId: "GID-8821", amount: "$15,000", status: "Closed Won", date: "Mar 10, 2024" },
    { name: "Visual Testing - Marketing Team", groupId: "GID-4402", amount: "$8,500", status: "Closed Won", date: "Feb 28, 2024" },
    { name: "Legacy Device Farm - Sunset", groupId: "GID-9910", amount: "$50,000", status: "Closed Lost", date: "Feb 15, 2024" },
    { name: "Standard Support Tier Upgrade", groupId: "GID-8821", amount: "$2,000", status: "Closed Lost", date: "Jan 20, 2024" },
    { name: "SDK Integration - Gaming Dept", groupId: "GID-4402", amount: "$12,000", status: "Closed Lost", date: "Jan 05, 2024" },
    { name: "Desktop Browser - AdHoc Unit", groupId: "GID-9910", amount: "$4,500", status: "Closed Lost", date: "Dec 15, 2023" },
    { name: "Performance Testing Pilot", groupId: "GID-8821", amount: "$9,000", status: "Closed Lost", date: "Nov 30, 2023" }
  ],
  crossRepLeads: [
    { name: "Alex Rivers", role: "QA Manager", rep: "Robert Smith", repRole: "AE", intentScore: 100, intentType: "Handraiser" },
    { name: "Taylor Wong", role: "QA Lead", rep: "Emily Brown", repRole: "BDR", intentScore: 90, intentType: "Handraiser" }
  ]
};

export default function OngoingDiscussions() {
  const oppRows = useSheetData("Opportunities");
  const crossRepRows = useSheetData("Cross Rep Leads");

  const discussions = React.useMemo(() => {
    if (!oppRows && !crossRepRows) return MOCK_DISCUSSIONS;

    const openOpportunities = oppRows
      ? oppRows
          .filter(r => {
            const s = (r["Status"] || r["status"] || "").toLowerCase();
            return s !== "closed won" && s !== "closed lost";
          })
          .map(r => ({
            name: r["Name"] || r["name"] || r["Opportunity Name"] || "",
            groupId: r["Group ID"] || r["group_id"] || r["GroupID"] || "",
            amount: r["Amount"] || r["amount"] || "$0",
            link: r["SFDC Link"] || r["sfdc_link"] || r["Link"] || "#",
            status: r["Status"] || r["status"] || r["Stage"] || "",
          }))
      : MOCK_DISCUSSIONS.openOpportunities;

    const recentOpportunities = oppRows
      ? oppRows
          .filter(r => {
            const s = (r["Status"] || r["status"] || "").toLowerCase();
            return s === "closed won" || s === "closed lost";
          })
          .map(r => ({
            name: r["Name"] || r["name"] || r["Opportunity Name"] || "",
            groupId: r["Group ID"] || r["group_id"] || r["GroupID"] || "",
            amount: r["Amount"] || r["amount"] || "$0",
            status: r["Status"] || r["status"] || "",
            date: r["Close Date"] || r["close_date"] || r["Date"] || "",
          }))
      : MOCK_DISCUSSIONS.recentOpportunities;

    const crossRepLeads = crossRepRows
      ? crossRepRows.map(r => ({
          name: r["Name"] || r["name"] || r["Lead Name"] || "",
          role: r["Role"] || r["role"] || r["Title"] || "",
          rep: r["Rep"] || r["rep"] || r["Rep Name"] || "",
          repRole: r["Rep Role"] || r["rep_role"] || "",
          intentScore: parseInt(r["Intent Score"] || r["intent_score"] || "0"),
          intentType: r["Intent Type"] || r["intent_type"] || "",
        }))
      : MOCK_DISCUSSIONS.crossRepLeads;

    return { openOpportunities, recentOpportunities, crossRepLeads };
  }, [oppRows, crossRepRows]);

  const getIntentColor = (type: string) => {
    switch (type) {
      case "Handraiser": return "bg-red-100 text-red-700 border-red-200 animate-pulse";
      case "Attendee": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Registered": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col h-[400px]">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-800 uppercase tracking-widest">
            <Briefcase className="w-4 h-4 text-primary" />
            Opportunities (Last 180 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div>
              <div className="flex items-center justify-between mb-2 sticky top-0 bg-white z-10 py-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Open Opportunities ({discussions.openOpportunities.length})</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-black h-4 uppercase tracking-tighter">Active Pipeline</Badge>
              </div>
              <div className="space-y-2">
                {discussions.openOpportunities.map((opp, idx) => (
                  <div key={idx} className="p-3 bg-white border rounded-lg flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm">
                    <div className="min-w-0 flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 font-bold border-slate-200 text-slate-400 bg-slate-50 uppercase shrink-0">
                          {opp.groupId}
                        </Badge>
                        <p className="text-xs font-bold text-slate-900 leading-tight truncate">{opp.name}</p>
                      </div>
                      <p className="text-[10px] font-mono font-bold text-primary">{opp.amount} · {opp.status}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href={opp.link} target="_blank" rel="noreferrer" className="p-2 rounded-md bg-slate-50 text-slate-400 hover:text-primary transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent className="text-[10px]">Review Opportunity in SFDC</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3 sticky top-0 bg-white z-10 py-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Closed Opportunities ({discussions.recentOpportunities.length})</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-[8px] border-emerald-100 bg-emerald-50 text-emerald-600 font-bold uppercase tracking-tighter">
                    {discussions.recentOpportunities.filter(o => o.status === 'Closed Won').length} Won
                  </Badge>
                  <Badge variant="outline" className="text-[8px] border-rose-100 bg-rose-50 text-rose-600 font-bold uppercase tracking-tighter">
                    {discussions.recentOpportunities.filter(o => o.status === 'Closed Lost').length} Lost
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                {discussions.recentOpportunities.map((opp, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <History className={`w-3 h-3 shrink-0 ${opp.status === 'Closed Won' ? 'text-emerald-400' : 'text-slate-300'}`} />
                      <Badge variant="outline" className="text-[7px] h-3 px-1 border-slate-100 text-slate-300 font-bold shrink-0">
                        {opp.groupId}
                      </Badge>
                      <span className="font-medium text-slate-600 truncate">{opp.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="font-bold text-slate-400 text-[10px]">{opp.amount}</span>
                      <Badge variant="outline" className={`text-[8px] h-4 border-none font-bold uppercase tracking-tighter ${
                        opp.status === 'Closed Won' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {opp.status === 'Closed Won' ? 'Won' : 'Lost'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden h-[400px] flex flex-col">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-800 uppercase tracking-widest">
            <MessageCircle className="w-4 h-4 text-amber-500" />
            Active Sales Discussions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto custom-scrollbar flex-1">
          {discussions.crossRepLeads.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-[10px] font-bold text-amber-800 leading-tight">
                  <span className="underline">{discussions.crossRepLeads.length} leads</span> currently in discussion with other reps. Coordination advised.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Lead Details</span>
                {discussions.crossRepLeads.map((lead, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 overflow-hidden">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 leading-tight truncate">{lead.name}</p>
                          {lead.intentType && (
                            <Badge className={`text-[7px] px-1 h-3.5 border font-bold uppercase tracking-tighter ${getIntentColor(lead.intentType)}`}>
                              {lead.intentType}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[9px] font-medium text-slate-500 truncate">{lead.role}</p>
                          <span className="text-slate-300 text-[8px] font-black">·</span>
                          <span className="text-[8px] font-black text-primary/40 uppercase tracking-tighter">Score: {lead.intentScore}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Owned By</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-[10px] font-bold text-slate-700">{lead.rep}</span>
                        <Badge className="bg-slate-200 text-slate-600 border-none text-[8px] h-3.5 px-1 font-black">{lead.repRole}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users className="w-8 h-8 text-slate-100 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">No active cross-rep discussions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
