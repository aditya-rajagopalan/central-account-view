import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Landmark, Linkedin, ExternalLink, Info, DollarSign, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSheetData } from "@/lib/dashboard-context";

const MOCK = {
  revenue: "$12.4B",
  description: "Global leader in digital transformation and cloud infrastructure services.",
  website: "https://acme.com",
  geographies: "HQ: New York, USA (Primary hubs in London, Bangalore, Tokyo)",
  devCount: "15,000+",
  linkedin: "https://linkedin.com/company/acme",
  parentAccount: "Acme Global Holdings (G-11002)",
  companyName: "Acme Corp",
  sfdcUrl: "https://salesforce.com/accounts/acme-corp",
  parentSfdcUrl: "https://salesforce.com/accounts/parent-acme",
};

export default function AccountPotential() {
  const sheetRows = useSheetData("Account");
  const row = sheetRows?.[0];

  const companyData = row ? {
    revenue: row["Revenue"] || row["revenue"] || MOCK.revenue,
    description: row["Description"] || row["description"] || MOCK.description,
    website: row["Website"] || row["website"] || MOCK.website,
    geographies: row["Geographies"] || row["geographies"] || row["HQ"] || MOCK.geographies,
    devCount: row["Dev Count"] || row["dev_count"] || row["Developers"] || MOCK.devCount,
    linkedin: row["LinkedIn"] || row["linkedin"] || MOCK.linkedin,
    parentAccount: row["Parent Account"] || row["parent_account"] || MOCK.parentAccount,
    companyName: row["Account Name"] || row["account_name"] || MOCK.companyName,
    sfdcUrl: row["SFDC URL"] || row["sfdc_url"] || MOCK.sfdcUrl,
    parentSfdcUrl: row["Parent SFDC URL"] || row["parent_sfdc_url"] || MOCK.parentSfdcUrl,
  } : MOCK;

  const getPotentialMarker = (count: string) => {
    const num = parseInt(count.replace(/[,+]/g, ''));
    if (num >= 500) return { label: "V. High Potential", color: "bg-emerald-500 text-white" };
    if (num >= 50) return { label: "High Potential", color: "bg-blue-500 text-white" };
    return { label: "Good Potential", color: "bg-slate-500 text-white" };
  };

  const potential = getPotentialMarker(companyData.devCount);

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-sm font-black flex items-center justify-between w-full text-slate-800 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-primary" />
            Account Potential & Profile
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Profile</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-slate-900 leading-tight">{companyData.companyName}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={companyData.sfdcUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-[#00A1E0] transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">View Account in Salesforce</TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "{companyData.description}"
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-1.5 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                <Landmark className="w-3.5 h-3.5 text-primary" />
                <span>Ultimate Parent Account</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-700">{companyData.parentAccount}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={companyData.parentSfdcUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-[#00A1E0] transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">View Parent Account in Salesforce</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
              </div>
              <p className="text-sm font-black text-slate-900 leading-none">{companyData.revenue}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-slate-900 leading-none">{companyData.devCount}</p>
                <Badge className={`text-[8px] font-black px-1.5 py-0 border-none uppercase tracking-tighter shrink-0 ${potential.color}`}>
                  {potential.label}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={companyData.website} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-100 hover:border-primary hover:text-primary transition-all shadow-sm">
                    <Globe className="w-4 h-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="text-[10px]">Company Website</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={companyData.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white border border-slate-100 hover:border-[#0077B5] hover:text-[#0077B5] transition-all shadow-sm">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent className="text-[10px]">LinkedIn Company Page</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Geographies</span>
            </div>
            <p className="text-xs font-medium leading-relaxed text-slate-200">
              {companyData.geographies}
            </p>
            <div className="mt-6 flex justify-end">
              <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-tighter">Global Presence</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
