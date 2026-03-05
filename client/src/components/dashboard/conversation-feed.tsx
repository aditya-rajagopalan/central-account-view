import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Ticket, Mail, Calendar, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConversationFeed() {
  const feed = [
    { id: 1, type: "CRM", title: "Quarterly Check-in Call", date: "2 hours ago", desc: "Discussed expansion to Percy. Pointed out CI/CD bottlenecks in their current Jenkins pipeline.", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
    { id: 2, type: "Support", title: "App Live iOS 17 Crash", date: "1 day ago", desc: "Resolved: User error on provisioning profile upload. Sent documentation for future reference.", icon: Ticket, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" },
    { id: 3, type: "Marketing", title: "Downloaded Cypress Guide", date: "3 days ago", desc: "Lead score increased by +15. Added to nurture sequence.", icon: Mail, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
    { id: 4, type: "CRM", title: "Cold Email Replied", date: "5 days ago", desc: "QA Manager asked for pricing on Automate.", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
    { id: 5, type: "Support", title: "Parallel Limit Reached", date: "1 week ago", desc: "Automated warning sent to admin regarding continuous queuing.", icon: Ticket, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" },
  ];

  return (
    <Card className="h-full flex flex-col shadow-sm border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
          <MessageSquare className="w-4 h-4 text-primary" />
          Global Conversation Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative overflow-hidden">
        <ScrollArea className="h-[500px] xl:h-[calc(100%-48px)] w-full absolute inset-0">
          <div className="p-5 space-y-5">
            {feed.map((item, index) => (
              <div key={item.id} className="flex gap-4 relative">
                {/* Timeline line */}
                {index !== feed.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-slate-100" />
                )}
                
                <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.bg} z-10 ring-4 ring-white border ${item.border}`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                
                <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all duration-200 group cursor-pointer hover:border-slate-300">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.bg} ${item.color}`}>
                      {item.type}
                    </span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1 group-hover:text-primary transition-colors">
                      {item.date}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}