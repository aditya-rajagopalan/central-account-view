import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Zap, User, ChevronRight, Award, Megaphone, Calendar, MapPin, MessageSquare, Filter, ArrowUpDown, History, Mail, Phone, ExternalLink, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function TeamEngagement() {
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [leadType, setLeadType] = React.useState("all");
  const [scoreFilter, setScoreFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("intent");

  const rawUsers = [
    { 
      id: "u1",
      name: "Alex Rivers", 
      role: "QA Manager", 
      groupName: "Core Platform Team",
      groupId: "GID-8821",
      type: "Paid",
      email: "alex.rivers@acme.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, USA",
      sfdcUrl: "https://salesforce.com/leads/u1",
      active: true, 
      marketingSignals: 15, 
      intentScore: 100,
      intentType: "Handraiser",
      lastSignal: "Masterclass: Selenium Automation",
      events: [
        { type: "CSF", status: "Handraiser", date: "2024-03-01", desc: "Contact Sales Form Submitted" },
        { type: "Masterclass", status: "Attended", date: "2024-02-28", desc: "Selenium Automation Masterclass" },
        { type: "StackConnect", status: "Attended", date: "2024-02-15", desc: "Leadership Summit NYC" },
        { type: "Simulive", status: "Attended", date: "2024-01-20", desc: "CI/CD Trends 2024" },
        { type: "Demo Request", status: "MQL", date: "2023-12-15", desc: "Enterprise Demo Request" },
        { type: "Webinar", status: "Registered", date: "2023-11-05", desc: "Scaling QA Teams" },
        { type: "Breakpoint", status: "Attended", date: "2023-10-12", desc: "Breakpoint 2023" },
        { type: "Dev Meet Up", status: "Attended", date: "2023-09-18", desc: "React Testing Workshop" },
        { type: "Webinar", status: "Attended", date: "2023-08-01", desc: "Mobile Automation 101" },
        { type: "Whitepaper", status: "Downloaded", date: "2023-06-15", desc: "The Future of Testing" },
        { type: "Masterclass", status: "Attended", date: "2023-05-10", desc: "Advanced Appium" },
        { type: "Simulive", status: "Registered", date: "2023-03-22", desc: "Visual Regression Testing" },
        { type: "StackConnect", status: "Attended", date: "2023-01-15", desc: "EMEA Leadership Summit" },
        { type: "Webinar", status: "Attended", date: "2022-11-30", desc: "Accessibility Testing" },
        { type: "CSF", status: "Handraiser", date: "2022-09-01", desc: "Initial Sales Inquiry" }
      ]
    },
    { 
      id: "u2",
      name: "Taylor Wong", 
      role: "QA Lead", 
      groupName: "Mobile App Group",
      groupId: "GID-4402",
      type: "Paid",
      email: "taylor.w@acme.com",
      phone: "+1 (555) 987-6543",
      location: "Austin, USA",
      sfdcUrl: "https://salesforce.com/leads/u2",
      active: true, 
      marketingSignals: 5, 
      intentScore: 90,
      intentType: "Handraiser",
      lastSignal: "Demo Request (Direct MQL)",
      events: [
        { type: "Demo Request", status: "MQL", date: "2024-03-02", desc: "Direct Demo Request" },
        { type: "Breakpoint", status: "Attended", date: "2024-02-20", desc: "Breakpoint 2024 Conference" },
        { type: "Account Specific Webinar", status: "Attended", date: "2024-02-10", desc: "Custom Platform Overview" }
      ]
    },
    { 
      id: "u3",
      name: "Sam Chen", 
      role: "SDET", 
      groupName: "Core Platform Team",
      groupId: "GID-8821",
      type: "Paid",
      email: "sam.chen@acme.com",
      phone: "+1 (555) 444-5555",
      location: "Toronto, Canada",
      sfdcUrl: "https://salesforce.com/leads/u3",
      active: true, 
      marketingSignals: 1, 
      intentScore: 50,
      intentType: "Attendee",
      lastSignal: "Simulive: Mobile Testing Trends",
      events: [
        { type: "Simulive", status: "Attended", date: "2024-02-25", desc: "Mobile Testing Trends" }
      ]
    },
    { 
      id: "u4",
      name: "Casey Lee", 
      role: "Software Engineer", 
      groupName: "Individual Contributor",
      groupId: "GID-9910",
      type: "Free",
      email: "casey.l@gmail.com",
      phone: "+1 (555) 222-3333",
      location: "London, UK",
      sfdcUrl: "https://salesforce.com/leads/u4",
      active: false, 
      marketingSignals: 1, 
      intentScore: 20,
      intentType: "Registered",
      lastSignal: "1:Many Webinar: Cypress Guide",
      events: [
        { type: "1:Many Webinar", status: "Registered (No Show)", date: "2024-02-29", desc: "Cypress Implementation Guide" }
      ]
    }
  ];

  const filteredAndSortedUsers = React.useMemo(() => {
    let result = [...rawUsers];
    if (search) {
      result = result.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.groupName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterType !== "all") {
      result = result.filter(u => {
        if (filterType === "MQL") return u.events.some(e => e.status === "MQL");
        return u.intentType === filterType;
      });
    }
    if (leadType !== "all") {
      result = result.filter(u => u.events.some(e => e.type.includes(leadType) || e.type === leadType));
    }
    if (scoreFilter !== "all") {
      result = result.filter(u => {
        if (scoreFilter === "High") return u.intentScore >= 80;
        if (scoreFilter === "Mid") return u.intentScore >= 40 && u.intentScore < 80;
        if (scoreFilter === "Low") return u.intentScore < 40;
        return true;
      });
    }
    result.sort((a, b) => {
      if (sortBy === "intent") return b.intentScore - a.intentScore;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return result;
  }, [search, filterType, leadType, scoreFilter, sortBy]);

  const paidUsersByTeam = React.useMemo(() => {
    const teams: Record<string, any[]> = {};
    filteredAndSortedUsers.filter(u => u.type === "Paid").forEach(u => {
      if (!teams[u.groupName]) teams[u.groupName] = [];
      teams[u.groupName].push(u);
    });
    return teams;
  }, [filteredAndSortedUsers]);

  const freeUsers = React.useMemo(() => {
    return filteredAndSortedUsers.filter(u => u.type === "Free");
  }, [filteredAndSortedUsers]);

  const getIntentColor = (type: string) => {
    switch (type) {
      case "Handraiser": return "bg-red-100 text-red-700 border-red-200 animate-pulse";
      case "Attendee": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Registered": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getEventIcon = (type: string) => {
    if (type.includes("Webinar") || type === "Simulive" || type === "Masterclass") return <Calendar className="w-3 h-3" />;
    if (type === "Dev Meet Up") return <MapPin className="w-3 h-3" />;
    if (type === "Demo Request" || type === "Chat") return <MessageSquare className="w-3 h-3" />;
    return <Calendar className="w-3 h-3" />;
  };

  const UserCard = ({ user }: { user: any }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const visibleEvents = user.events.slice(0, 3);
    const hiddenEvents = user.events.slice(3);

    return (
      <div className="group/user relative p-4 rounded-xl border border-slate-100 bg-white hover:border-primary/30 hover:shadow-md transition-all mb-3 last:mb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-slate-400 font-bold text-xs uppercase">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              {user.active && <div className="absolute -right-0.5 -bottom-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />}
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-900 leading-none">{user.name}</span>
                {user.intentType && (
                  <Badge className={`text-[8px] px-1.5 h-4 border font-bold uppercase tracking-tighter ${getIntentColor(user.intentType)}`}>
                    {user.intentType}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-slate-500 font-medium">{user.role}</span>
                <span className="text-slate-200 font-bold">·</span>
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium">
                  <MapPin className="w-2.5 h-2.5" />
                  {user.location}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={`mailto:${user.email}`} className="text-slate-400 hover:text-primary transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">{user.email}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={`tel:${user.phone}`} className="text-slate-400 hover:text-primary transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">{user.phone}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={user.sfdcUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#00A1E0] transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">Open in Salesforce</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href={`https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(user.name)}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0077B5] transition-colors">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">LinkedIn Profile</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="text-[10px] font-black text-primary/40 tracking-tighter uppercase">
              Score: {user.intentScore}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Engagement Timeline ({user.marketingSignals} Signals)
                </span>
              </div>
              {user.marketingSignals > 3 && (
                <CollapsibleTrigger asChild>
                  <button className="text-[9px] font-bold text-primary hover:underline uppercase tracking-tight cursor-pointer">
                    {isOpen ? "Show Less" : `View All (${user.marketingSignals})`}
                  </button>
                </CollapsibleTrigger>
              )}
            </div>

            <div className="relative space-y-3 pl-3.5">
              <div className="absolute left-1 top-1.5 bottom-1.5 w-[1px] bg-slate-100" />
              
              {visibleEvents.map((event: any, idx: number) => (
                <TimelineItem key={idx} event={event} />
              ))}

              <CollapsibleContent className="space-y-3">
                {hiddenEvents.map((event: any, idx: number) => (
                  <TimelineItem key={idx + 3} event={event} />
                ))}
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>
    );
  };

  const TimelineItem = ({ event }: { event: any }) => (
    <div className="relative flex items-center justify-between gap-3 group/item">
      <div className={`absolute -left-[11.5px] w-2 h-2 rounded-full border-2 border-white transition-transform group-hover/item:scale-125 ${
        event.status.includes('Handraiser') ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
        event.status.includes('Attended') ? 'bg-emerald-500' : 
        'bg-slate-300'
      }`} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p className="text-[10px] font-bold text-slate-700 truncate">{event.desc}</p>
          <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">{event.date}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 border-slate-100 text-slate-500 font-medium bg-white">
            {event.type}
          </Badge>
          <span className="text-[9px] text-slate-400 italic font-medium">({event.status})</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col shadow-sm border-slate-200 overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
        <CardTitle className="text-sm font-bold flex items-center justify-between w-full text-slate-800 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Marketing Intent Leaderboard
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 rounded text-[9px] font-bold text-red-600 border border-red-100 uppercase tracking-tighter animate-pulse">
            <Zap className="w-2.5 h-2.5" />
            High Intent
          </div>
        </CardTitle>
      </CardHeader>
      
      <div className="p-3 bg-white border-b border-slate-100 space-y-2">
        <div className="relative">
          <Input 
            placeholder="Search users or teams..." 
            className="h-8 text-xs pl-8 bg-slate-50 border-none focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Filter className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={leadType} onValueChange={setLeadType}>
            <SelectTrigger className="h-7 text-[10px] bg-white border border-slate-200 flex-1 min-w-[100px] shadow-sm">
              <SelectValue placeholder="Lead Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl z-[100] relative">
              <SelectItem value="all" className="text-[10px] bg-white hover:bg-slate-50">All Lead Types</SelectItem>
              <SelectItem value="Signup" className="text-[10px] bg-white hover:bg-slate-50">Signup</SelectItem>
              <SelectItem value="CSF" className="text-[10px] bg-white hover:bg-slate-50">CSF</SelectItem>
              <SelectItem value="Demo" className="text-[10px] bg-white hover:bg-slate-50">Demo</SelectItem>
              <SelectItem value="Webinar" className="text-[10px] bg-white hover:bg-slate-50">Webinar</SelectItem>
              <SelectItem value="StackConnect" className="text-[10px] bg-white hover:bg-slate-50">StackConnect</SelectItem>
              <SelectItem value="Simulive" className="text-[10px] bg-white hover:bg-slate-50">Simulive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-7 text-[10px] bg-white border border-slate-200 flex-1 min-w-[100px] shadow-sm">
              <SelectValue placeholder="Engagement" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl z-[100] relative">
              <SelectItem value="all" className="text-[10px] bg-white hover:bg-slate-50">All Engagement</SelectItem>
              <SelectItem value="Handraiser" className="text-[10px] bg-white hover:bg-slate-50">Handraiser</SelectItem>
              <SelectItem value="Attendee" className="text-[10px] bg-white hover:bg-slate-50">Event Attendee</SelectItem>
              <SelectItem value="Registered" className="text-[10px] bg-white hover:bg-slate-50">Event RSVP</SelectItem>
              <SelectItem value="MQL" className="text-[10px] bg-white hover:bg-slate-50">MQLs</SelectItem>
            </SelectContent>
          </Select>
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="h-7 text-[10px] bg-white border border-slate-200 flex-1 min-w-[100px] shadow-sm">
              <SelectValue placeholder="Intent Score" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl z-[100] relative">
              <SelectItem value="all" className="text-[10px] bg-white hover:bg-slate-50">All Scores</SelectItem>
              <SelectItem value="High" className="text-[10px] bg-white hover:bg-slate-50">High (80+)</SelectItem>
              <SelectItem value="Mid" className="text-[10px] bg-white hover:bg-slate-50">Mid (40-79)</SelectItem>
              <SelectItem value="Low" className="text-[10px] bg-white hover:bg-slate-50">Low (&lt;40)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-7 text-[10px] bg-white border border-slate-200 flex-1 min-w-[100px] shadow-sm">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl z-[100] relative">
              <SelectItem value="intent" className="text-[10px] bg-white hover:bg-slate-50">By Intent Score</SelectItem>
              <SelectItem value="name" className="text-[10px] bg-white hover:bg-slate-50">By Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent className="p-0 flex-1 flex flex-col min-h-0 bg-slate-50/30">
        <Tabs defaultValue="paid" className="w-full h-full flex flex-col">
          <div className="px-3 pt-3">
            <TabsList className="w-full h-8 grid grid-cols-2 bg-slate-100/50 p-1">
              <TabsTrigger value="paid" className="text-[10px] font-bold uppercase tracking-wider">Paid Teams</TabsTrigger>
              <TabsTrigger value="free" className="text-[10px] font-bold uppercase tracking-wider">FREE USERS</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <TabsContent value="paid" className="m-0 p-3 outline-none">
              {Object.keys(paidUsersByTeam).length > 0 ? (
                Object.entries(paidUsersByTeam).map(([team, users]) => (
                  <div key={team} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-3 px-1 sticky top-0 bg-slate-50/95 backdrop-blur-sm py-1 z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-3 bg-primary rounded-full" />
                        <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{team}</h3>
                        <Badge variant="outline" className="text-[8px] h-3.5 border-slate-200 text-slate-400 font-bold">{users[0].groupId}</Badge>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{users.length} Users</span>
                    </div>
                    {users.map(user => <UserCard key={user.id} user={user} />)}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest">No paid team matches</div>
              )}
            </TabsContent>

            <TabsContent value="free" className="m-0 p-3 outline-none">
              {freeUsers.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-1.5 h-3 bg-slate-300 rounded-full" />
                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">FREE USERS</h3>
                  </div>
                  {freeUsers.map(user => <UserCard key={user.id} user={user} />)}
                </div>
              ) : (
                  <div className="py-12 text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest">No matching FREE USERS</div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}