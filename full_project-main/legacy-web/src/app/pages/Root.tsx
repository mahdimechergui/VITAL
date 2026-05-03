import { Outlet, NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Brain, 
  MessageSquare, 
  Database, 
  Shield, 
  Calendar, 
  Users, 
  Lock,
  Activity
} from "lucide-react";

export function Root() {
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { path: "/architect", icon: Brain, label: "Architect" },
    { path: "/liaison", icon: MessageSquare, label: "Liaison" },
    { path: "/archivist", icon: Database, label: "Archivist" },
    { path: "/sentinel", icon: Shield, label: "Sentinel" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/members", icon: Users, label: "Members" },
    { path: "/vault", icon: Lock, label: "Vault" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="w-8 h-8 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-50"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VITAL
              </h1>
              <p className="text-xs text-gray-400">Don't manage your club. Lead it.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-cyan-500/20 bg-gray-900/30 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
