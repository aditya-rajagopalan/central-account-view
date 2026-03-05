import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Award, Zap, Star, ShieldCheck, Mail, Phone, ChevronRight, MapPin, ExternalLink, Linkedin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSheetData } from "@/lib/dashboard-context";

const MOCK_PERSONAS = [
  {
    name: "Alex Rivers", role: "QA Manager", team: "Core Platform", type: "Handraiser",
    email: "alex.rivers@acme.com", phone: "+1 (555) 123-4567", location: "San Francisco, USA",
    sfdcUrl: "https://salesforce.com/leads/u1", reason: "Requested sales contact after Masterclass", score: 98,
  },
  {
    name: "Taylor Wong", role: "QA Lead", team: "Mobile App", type: "Champion",
    email: "taylor.w@acme.com", phone: "+1 (555) 987-6543", location: "Austin, USA",
    sfdcUrl: "https://salesforce.com/leads/u2", reason: "High usage + 5 marketing touches", score: 92,
  },
  {
    name: "Sam Chen", role: "SDET", team: "Core Platform", type: "Most Engaged",
    email: "sam.chen@acme.com", phone: "+1 (555) 444-5555", location: "Toronto, Canada",
    sfdcUrl: "https://salesforce.com/leads/u3", reason: "Attended last 3 webinars in 30 days", score: 85,
  },
];

const TYPE_STYLES: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  "Handraiser": { icon: Zap, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  "Champion": { icon: Star, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  "Most Engaged": { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
};
const DEFAULT_STYLE = { icon: User, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" };

export default function TopPersonas() {
  const sheetRows = useSheetData("Personas");

  const personas = React.useMemo(() => {
    if (sheetRows && sheetRows.length > 0) {
      return sheetRows.slice(0, 6).map(r => ({
        name: r["Name"] || r["name"] || "",
        role: r["Role"] || r["role"] || r["Title"] || "",
        team: r["Team"] || r["team"] || "",
        type: r["Type"] || r["type"] || r["Persona Type"] || "Most Engaged",
        email: r["Email"] || r["email"] || "",
        phone: r["Phone"] || r["phone"] || "",
        location: r["Location"] || r["location"] || "",
        sfdcUrl: r["SFDC URL"] || r["sfdc_url"] || r["Link"] || "#",
        reason: r["Reason"] || r["reason"] || r["Targeting Logic"] || "",
        score: parseInt(r["Score"] || r["score"] || r["Intent Score"] || "0"),
      }));
    }
    return MOCK_PERSONAS;
  }, [sheetRows]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">Top Personas to Reach Out</h2>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{personas.length} High-Priority Targets Identified</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {personas.map((persona) => {
          const style = TYPE_STYLES[persona.type] || DEFAULT_STYLE;
          const Icon = style.icon;
          return (
            <Card key={persona.name} className={`border ${style.border} shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer`}>
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-12 h-12" />
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-bold text-sm text-slate-500 ${style.bg}`}>
                      {persona.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{persona.name}</h3>
                      <p className="text-[10px] font-medium text-slate-500">{persona.role}</p>
                      {persona.location && (
                        <div className="flex items-center gap-1 text-slate-400 text-[9px] font-medium mt-1">
                          <MapPin className="w-2.5 h-2.5" />
                          {persona.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className={`text-[9px] font-black px-1.5 h-4 border-none uppercase tracking-tighter ${style.bg} ${style.color}`}>
                      {persona.type}
                    </Badge>
                    <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Score: {persona.score}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {persona.reason && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Targeting Logic</p>
                      <p className="text-[11px] text-slate-700 font-medium leading-relaxed italic">
                        "{persona.reason}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-3">
                      {persona.email && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={`mailto:${persona.email}`} className="text-slate-400 hover:text-primary transition-colors">
                              <Mail className="w-4 h-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent className="text-[10px]">{persona.email}</TooltipContent>
                        </Tooltip>
                      )}
                      {persona.phone && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={`tel:${persona.phone}`} className="text-slate-400 hover:text-primary transition-colors">
                              <Phone className="w-4 h-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent className="text-[10px]">{persona.phone}</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a href={persona.sfdcUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#00A1E0] transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="text-[10px]">Open in Salesforce</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a href={`https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(persona.name)}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0077B5] transition-colors">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="text-[10px]">LinkedIn Profile</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
