import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, AlertTriangle, CheckCircle, XCircle, Lock, Eye, Activity, TrendingUp } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const securityLogs = [
  {
    id: 1,
    timestamp: "2026-04-15 14:32:15",
    event: "Login Attempt",
    user: "president@tpl.tn",
    status: "success",
    ip: "196.203.x.x",
    location: "Kairouan, Tunisia",
    severity: "low"
  },
  {
    id: 2,
    timestamp: "2026-04-15 03:15:42",
    event: "Bulk Download Attempt",
    user: "member.unknown@tpl.tn",
    status: "blocked",
    ip: "45.129.x.x",
    location: "Unknown",
    severity: "high"
  },
  {
    id: 3,
    timestamp: "2026-04-15 09:20:11",
    event: "Password Reset",
    user: "treasurer@tpl.tn",
    status: "success",
    ip: "196.203.x.x",
    location: "Kairouan, Tunisia",
    severity: "medium"
  },
  {
    id: 4,
    timestamp: "2026-04-14 23:45:03",
    event: "Failed Login (5x)",
    user: "admin@tpl.tn",
    status: "blocked",
    ip: "103.74.x.x",
    location: "Unknown",
    severity: "high"
  },
  {
    id: 5,
    timestamp: "2026-04-14 16:10:28",
    event: "Document Access",
    user: "vp@tpl.tn",
    status: "success",
    ip: "196.203.x.x",
    location: "Kairouan, Tunisia",
    severity: "low"
  }
];

const threatData = [
  { day: "Mon", attempts: 3, blocked: 1 },
  { day: "Tue", attempts: 5, blocked: 2 },
  { day: "Wed", attempts: 2, blocked: 0 },
  { day: "Thu", attempts: 8, blocked: 5 },
  { day: "Fri", attempts: 4, blocked: 2 },
  { day: "Sat", attempts: 1, blocked: 0 },
  { day: "Sun", attempts: 2, blocked: 1 }
];

const activityData = [
  { hour: "00:00", activity: 5 },
  { hour: "04:00", activity: 12 },
  { hour: "08:00", activity: 45 },
  { hour: "12:00", activity: 120 },
  { hour: "16:00", activity: 85 },
  { hour: "20:00", activity: 35 },
];

export function SentinelAgent() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
            <Shield className="w-8 h-8 text-orange-400" />
          </div>
          <div className="absolute inset-0 bg-orange-400 blur-xl opacity-30"></div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-orange-400">The Sentinel</h1>
          <p className="text-gray-400 mt-1">AI-Powered Security Monitor for Threat Detection</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-semibold">System Secure</span>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Passed Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">1,247</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-orange-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">2</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Threats Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">11</div>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-cyan-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Encryption Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">E2EE</div>
            <p className="text-xs text-gray-500 mt-1">All data encrypted</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-orange-400">Threat Detection (7 Days)</CardTitle>
            <CardDescription>Login attempts vs blocked threats</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="attempts" fill="#fb923c" name="Attempts" />
                <Bar dataKey="blocked" fill="#ef4444" name="Blocked" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400">User Activity Pattern</CardTitle>
            <CardDescription>Active sessions throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Security Logs */}
      <Card className="bg-gray-900 border-orange-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-orange-400" />
            Recent Security Events
          </CardTitle>
          <CardDescription>Real-time monitoring of system access and threats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border transition-all hover:bg-gray-800/50 ${
                  log.severity === "high"
                    ? "bg-red-500/5 border-red-500/30"
                    : log.severity === "medium"
                    ? "bg-orange-500/5 border-orange-500/30"
                    : "bg-gray-800/30 border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {log.status === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <h4 className="font-semibold text-gray-200">{log.event}</h4>
                      <Badge
                        variant="outline"
                        className={
                          log.severity === "high"
                            ? "border-red-500 text-red-400"
                            : log.severity === "medium"
                            ? "border-orange-500 text-orange-400"
                            : "border-gray-600 text-gray-400"
                        }
                      >
                        {log.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-400">
                      <div>
                        <span className="text-gray-500">User:</span> {log.user}
                      </div>
                      <div>
                        <span className="text-gray-500">IP:</span> {log.ip}
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span> {log.location}
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span> {log.timestamp}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={
                      log.status === "success"
                        ? "bg-green-500/10 text-green-400 border-green-500/30"
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    }
                  >
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="bg-gradient-to-r from-orange-900/20 via-red-900/20 to-pink-900/20 border-orange-500/30">
        <CardHeader>
          <CardTitle>Active Security Measures</CardTitle>
          <CardDescription>Automated protection systems in place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-900/50 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-sm">Zero Trust Authentication</h4>
              </div>
              <p className="text-xs text-gray-400">OAuth2 with biometric verification enabled</p>
            </div>

            <div className="p-4 rounded-lg bg-gray-900/50 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-sm">Brute Force Protection</h4>
              </div>
              <p className="text-xs text-gray-400">Auto-lock after 5 failed attempts, 15-min cooldown</p>
            </div>

            <div className="p-4 rounded-lg bg-gray-900/50 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-sm">Data Exfiltration Monitor</h4>
              </div>
              <p className="text-xs text-gray-400">Flags suspicious bulk downloads, especially after hours</p>
            </div>

            <div className="p-4 rounded-lg bg-gray-900/50 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-sm">Email Phishing Scanner</h4>
              </div>
              <p className="text-xs text-gray-400">Analyzes partnership emails for malicious links</p>
            </div>

            <div className="p-4 rounded-lg bg-gray-900/50 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-sm">E2E Encryption</h4>
              </div>
              <p className="text-xs text-gray-400">All sensitive documents encrypted at rest and in transit</p>
            </div>

            <div className="p-4 rounded-lg bg-gray-900/50 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-sm">Real-time Monitoring</h4>
              </div>
              <p className="text-xs text-gray-400">24/7 log analysis with ML anomaly detection</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="bg-gray-900 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Active Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-400 mb-1">Suspicious Bulk Download Blocked</h4>
                  <p className="text-sm text-gray-300 mb-2">
                    User attempted to download entire member database at 03:15 AM from unknown IP. Session automatically frozen.
                  </p>
                  <div className="text-xs text-gray-400">
                    <strong>Action Required:</strong> Review user account and verify identity before unlocking.
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">HIGH</Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-400 mb-1">Multiple Failed Login Attempts</h4>
                  <p className="text-sm text-gray-300 mb-2">
                    5 consecutive failed login attempts on admin account from IP 103.74.x.x. Account temporarily locked.
                  </p>
                  <div className="text-xs text-gray-400">
                    <strong>Status:</strong> Auto-resolved. Unlocks in 12 minutes.
                  </div>
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">MEDIUM</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
