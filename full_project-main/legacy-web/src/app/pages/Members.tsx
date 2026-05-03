import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Users, Search, UserPlus, Mail, Phone, Shield } from "lucide-react";

const members = [
  {
    id: 1,
    name: "Ahmed Ben Salem",
    email: "ahmed.bensalem@issatkr.tn",
    phone: "+216 XX XXX XXX",
    role: "President",
    department: "Computer Science",
    year: "3rd Year",
    joinDate: "Sep 2024",
    eventsAttended: 12,
    status: "active"
  },
  {
    id: 2,
    name: "Fatima Trabelsi",
    email: "fatima.trabelsi@issatkr.tn",
    phone: "+216 XX XXX XXX",
    role: "Vice President",
    department: "Software Engineering",
    year: "3rd Year",
    joinDate: "Sep 2024",
    eventsAttended: 11,
    status: "active"
  },
  {
    id: 3,
    name: "Mohamed Kacem",
    email: "mohamed.kacem@issatkr.tn",
    phone: "+216 XX XXX XXX",
    role: "Treasurer",
    department: "Computer Science",
    year: "2nd Year",
    joinDate: "Oct 2024",
    eventsAttended: 9,
    status: "active"
  },
  {
    id: 4,
    name: "Leila Mansouri",
    email: "leila.mansouri@issatkr.tn",
    phone: "+216 XX XXX XXX",
    role: "Events Coordinator",
    department: "Information Systems",
    year: "3rd Year",
    joinDate: "Sep 2024",
    eventsAttended: 10,
    status: "active"
  },
  {
    id: 5,
    name: "Youssef Gharbi",
    email: "youssef.gharbi@issatkr.tn",
    phone: "+216 XX XXX XXX",
    role: "Member",
    department: "Software Engineering",
    year: "1st Year",
    joinDate: "Nov 2024",
    eventsAttended: 5,
    status: "active"
  },
  {
    id: 6,
    name: "Amina Khalil",
    email: "amina.khalil@issatkr.tn",
    phone: "+216 XX XXX XXX",
    role: "Member",
    department: "Computer Science",
    year: "2nd Year",
    joinDate: "Sep 2024",
    eventsAttended: 8,
    status: "active"
  }
];

export function Members() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    if (role === "President") return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    if (role === "Vice President") return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    if (role === "Treasurer") return "bg-pink-500/20 text-pink-400 border-pink-500/30";
    if (role.includes("Coordinator")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Members Directory</h1>
          <p className="text-gray-400 mt-1">Manage club members and roles</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-gray-900">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-cyan-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">156</div>
            <p className="text-xs text-gray-500">+12 this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Board Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">8</div>
            <p className="text-xs text-gray-500">Executive team</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-pink-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Active This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-400">142</div>
            <p className="text-xs text-gray-500">91% engagement</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-orange-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">New Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">23</div>
            <p className="text-xs text-gray-500">Since January</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search members by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700"
          />
        </div>
        <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
          Filter
        </Button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="bg-gray-900 border-gray-700 hover:border-cyan-500/30 transition-all">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 border-2 border-cyan-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white font-semibold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-100 truncate">{member.name}</h3>
                  <Badge className={`${getRoleColor(member.role)} text-xs mt-1`}>
                    {member.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-700 text-xs">
                <div>
                  <div className="text-gray-500">Department</div>
                  <div className="text-gray-300 font-semibold">{member.department}</div>
                </div>
                <div>
                  <div className="text-gray-500">Year</div>
                  <div className="text-gray-300 font-semibold">{member.year}</div>
                </div>
                <div>
                  <div className="text-gray-500">Joined</div>
                  <div className="text-gray-300 font-semibold">{member.joinDate}</div>
                </div>
                <div>
                  <div className="text-gray-500">Events</div>
                  <div className="text-cyan-400 font-semibold">{member.eventsAttended}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:border-cyan-500/30 hover:text-cyan-400">
                  View Profile
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:border-purple-500/30 hover:text-purple-400">
                  <Mail className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Privacy Notice */}
      <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-400" />
            Data Protection & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-400">
            All member data is encrypted with E2E encryption and protected by Zero Trust authentication. 
            Access is logged and monitored by the Sentinel agent. Only authorized board members can view 
            sensitive information like phone numbers and email addresses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
