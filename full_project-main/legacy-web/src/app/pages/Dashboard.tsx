import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PulseLine } from "../components/PulseLine";
import { Activity, TrendingUp, Users, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router";

const clubHealthData = [
  { month: "Oct", engagement: 65, budget: 70, events: 60 },
  { month: "Nov", engagement: 72, budget: 68, events: 75 },
  { month: "Dec", engagement: 68, budget: 72, events: 70 },
  { month: "Jan", engagement: 85, budget: 80, events: 82 },
  { month: "Feb", engagement: 88, budget: 85, events: 90 },
  { month: "Mar", engagement: 92, budget: 88, events: 95 },
];

const upcomingEvents = [
  { name: "React Workshop", date: "Apr 20, 2026", attendees: 45, status: "planned" },
  { name: "Spring Hackathon", date: "May 5, 2026", attendees: 120, status: "confirmed" },
  { name: "Tech Talk Series", date: "May 15, 2026", attendees: 30, status: "draft" },
];

export function Dashboard() {
  const overallHealth = 92; // Calculated from recent activity

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-900/20 p-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Club Vital Signs</h2>
              <p className="text-gray-400">Real-time health monitoring for TPL Club</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {overallHealth}%
              </div>
              <p className="text-sm text-gray-400">Overall Health</p>
            </div>
          </div>
          
          <PulseLine health={overallHealth} className="mb-4" />
          
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-300">System Status: </span>
            <span className="text-cyan-400 font-semibold">Optimal</span>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-cyan-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">156</div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">8</div>
            <p className="text-xs text-gray-500 mt-1">3 completed, 5 upcoming</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-pink-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-400">68%</div>
            <p className="text-xs text-gray-500 mt-1">$6,800 of $10,000</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">2</div>
            <p className="text-xs text-gray-500 mt-1">Low priority, resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-cyan-500/20">
          <CardHeader>
            <CardTitle>Club Health Trend</CardTitle>
            <CardDescription>Engagement, budget, and event metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={clubHealthData}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorEngagement)"
                />
                <Area
                  type="monotone"
                  dataKey="budget"
                  stroke="#a855f7"
                  fillOpacity={1}
                  fill="url(#colorBudget)"
                />
                <Area
                  type="monotone"
                  dataKey="events"
                  stroke="#ec4899"
                  fillOpacity={1}
                  fill="url(#colorEvents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-purple-500/20">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next scheduled activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-500/30 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-gray-200">{event.name}</h4>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-400">
                      {event.attendees}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      event.status === "confirmed"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : event.status === "planned"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      {event.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Agents Quick Access */}
      <Card className="bg-gradient-to-r from-gray-900 via-cyan-900/10 to-purple-900/10 border-cyan-500/30">
        <CardHeader>
          <CardTitle>Your Digital Board Members</CardTitle>
          <CardDescription>AI agents ready to assist</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Architect", desc: "Strategic Planning", color: "cyan", path: "/architect" },
              { name: "Liaison", desc: "PR & Branding", color: "purple", path: "/liaison" },
              { name: "Archivist", desc: "Knowledge Base", color: "pink", path: "/archivist" },
              { name: "Sentinel", desc: "Security Monitor", color: "orange", path: "/sentinel" },
            ].map((agent) => (
              <Link
                key={agent.name}
                to={agent.path}
                className={`p-4 rounded-lg border border-${agent.color}-500/20 bg-gray-800/50 hover:bg-gray-800 hover:border-${agent.color}-500/50 transition-all group cursor-pointer`}
              >
                <h4 className={`font-semibold text-${agent.color}-400 mb-1`}>
                  {agent.name}
                </h4>
                <p className="text-sm text-gray-400">{agent.desc}</p>
                <div className={`mt-2 text-xs text-${agent.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}