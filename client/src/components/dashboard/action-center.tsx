import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, AlertTriangle, PlayCircle, Copy, CheckCircle2, Megaphone, Zap, Laptop, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActionCenter() {
  const productSignals = [
    { id: "p1", title: "Failed Builds Spiked", icon: AlertTriangle, desc: "Automate failure rate > 20%" },
    { id: "p2", title: "Parallel Limit Reached", icon: PlayCircle, desc: "Hit 100% capacity on App Live" },
  ];

  const marketingSignals = [
    { id: "m1", title: "Webinar Handraiser", icon: Zap, desc: "Attended Masterclass & Requested Sales" },
    { id: "m2", title: "High Intent Activity", icon: Target, desc: "5+ Marketing touches in 30 days" },
  ];

  return (
    <Card className="h-full flex flex-col border-slate-200 shadow-sm bg-white">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
        <CardTitle className="text-sm font-black flex items-center gap-2 text-slate-800 uppercase tracking-widest">
          <Target className="w-4 h-4 text-primary" />
          Priority Signals
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 flex-1 flex flex-col gap-4 overflow-hidden">
        <Tabs defaultValue="product" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-2 h-9 bg-slate-100/50 mb-4 p-1">
            <TabsTrigger value="product" className="text-[10px] font-bold uppercase tracking-tight flex items-center gap-2">
              <Laptop className="w-3 h-3" /> Product
            </TabsTrigger>
            <TabsTrigger value="marketing" className="text-[10px] font-bold uppercase tracking-tight flex items-center gap-2">
              <Megaphone className="w-3 h-3" /> Marketing
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <TabsContent value="product" className="mt-0 space-y-2.5 outline-none">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Critical Product Triggers</h4>
              {productSignals.map(s => (
                <div key={s.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-black uppercase tracking-tight text-slate-800">{s.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate font-medium">{s.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="marketing" className="mt-0 space-y-2.5 outline-none">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">High Intent Triggers</h4>
              {marketingSignals.map(s => (
                <div key={s.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-black uppercase tracking-tight text-slate-800">{s.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate font-medium">{s.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-auto p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Recommended Action</span>
          </div>
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            Review the signals above and coordinate with the Account Owners for personalized outreach via Salesforce or Outreach.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}