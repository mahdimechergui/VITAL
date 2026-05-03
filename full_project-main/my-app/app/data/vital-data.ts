export type EventItem = {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
  attendees: { registered: number; capacity: number };
  budget: number;
  status: string;
  organizer: string;
};

export type MemberRecord = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  year: string;
  joinDate: string;
  eventsAttended: number;
  status: string;
  is_blacklisted?: boolean;
};

export type VaultDocument = {
  id: number;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  encrypted: boolean;
  accessLevel: string;
};

export type SecurityLog = {
  id: number;
  timestamp: string;
  event: string;
  user: string;
  status: string;
  ip: string;
  location: string;
  severity: string;
};

export const clubHealthData = [
  { month: "Oct", engagement: 65, budget: 70, events: 60 },
  { month: "Nov", engagement: 72, budget: 68, events: 75 },
  { month: "Dec", engagement: 68, budget: 72, events: 70 },
  { month: "Jan", engagement: 85, budget: 80, events: 82 },
  { month: "Feb", engagement: 88, budget: 85, events: 90 },
  { month: "Mar", engagement: 92, budget: 88, events: 95 },
];

export const upcomingEvents = [
  { name: "React Workshop", date: "Apr 20, 2026", attendees: 45, status: "planned" },
  { name: "Spring Hackathon", date: "May 5, 2026", attendees: 120, status: "confirmed" },
  { name: "Tech Talk Series", date: "May 15, 2026", attendees: 30, status: "draft" },
];

export const events: EventItem[] = [
  {
    id: 1,
    name: "React Advanced Workshop",
    date: "April 25, 2026",
    time: "14:00 - 17:00",
    venue: "Amphitheater B, ISSATKR",
    attendees: { registered: 58, capacity: 80 },
    budget: 550,
    status: "confirmed",
    organizer: "Sarah Chen",
  },
  {
    id: 2,
    name: "Spring Hackathon 2026",
    date: "May 5-7, 2026",
    time: "48 hours",
    venue: "Innovation Lab",
    attendees: { registered: 92, capacity: 120 },
    budget: 8500,
    status: "confirmed",
    organizer: "TPL Board",
  },
  {
    id: 3,
    name: "AI & Sustainability Tech Talk",
    date: "May 15, 2026",
    time: "18:00 - 20:00",
    venue: "Conference Room A",
    attendees: { registered: 28, capacity: 50 },
    budget: 300,
    status: "planning",
    organizer: "Dr. Amina Khalil",
  },
  {
    id: 4,
    name: "Career Fair 2026",
    date: "June 2, 2026",
    time: "09:00 - 16:00",
    venue: "Main Hall",
    attendees: { registered: 0, capacity: 200 },
    budget: 2000,
    status: "draft",
    organizer: "Career Team",
  },
];

export const members: MemberRecord[] = [
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
  },
];

export const vaultDocuments: VaultDocument[] = [
  {
    id: 1,
    name: "TechCorp Sponsorship Contract 2026.pdf",
    type: "Contract",
    uploadedBy: "President",
    uploadDate: "Mar 10, 2026",
    size: "2.4 MB",
    encrypted: true,
    accessLevel: "Board Only",
  },
  {
    id: 2,
    name: "Financial Report Q1 2026.xlsx",
    type: "Financial",
    uploadedBy: "Treasurer",
    uploadDate: "Apr 1, 2026",
    size: "850 KB",
    encrypted: true,
    accessLevel: "Board Only",
  },
  {
    id: 3,
    name: "InnovateTN Partnership Agreement.pdf",
    type: "Contract",
    uploadedBy: "Vice President",
    uploadDate: "Feb 20, 2026",
    size: "1.8 MB",
    encrypted: true,
    accessLevel: "Board Only",
  },
  {
    id: 4,
    name: "Member Database Export.csv",
    type: "Database",
    uploadedBy: "Admin",
    uploadDate: "Apr 10, 2026",
    size: "124 KB",
    encrypted: true,
    accessLevel: "President Only",
  },
  {
    id: 5,
    name: "Hackathon 2024 Budget Breakdown.xlsx",
    type: "Financial",
    uploadedBy: "Treasurer",
    uploadDate: "Mar 25, 2024",
    size: "680 KB",
    encrypted: true,
    accessLevel: "Board + Finance",
  },
];

export const securityLogs: SecurityLog[] = [
  {
    id: 1,
    timestamp: "2026-04-15 14:32:15",
    event: "Login Attempt",
    user: "president@tpl.tn",
    status: "success",
    ip: "196.203.x.x",
    location: "Kairouan, Tunisia",
    severity: "low",
  },
  {
    id: 2,
    timestamp: "2026-04-15 03:15:42",
    event: "Bulk Download Attempt",
    user: "member.unknown@tpl.tn",
    status: "blocked",
    ip: "45.129.x.x",
    location: "Unknown",
    severity: "high",
  },
  {
    id: 3,
    timestamp: "2026-04-15 09:20:11",
    event: "Password Reset",
    user: "treasurer@tpl.tn",
    status: "success",
    ip: "196.203.x.x",
    location: "Kairouan, Tunisia",
    severity: "medium",
  },
  {
    id: 4,
    timestamp: "2026-04-14 23:45:03",
    event: "Failed Login (5x)",
    user: "admin@tpl.tn",
    status: "blocked",
    ip: "103.74.x.x",
    location: "Unknown",
    severity: "high",
  },
  {
    id: 5,
    timestamp: "2026-04-14 16:10:28",
    event: "Document Access",
    user: "vp@tpl.tn",
    status: "success",
    ip: "196.203.x.x",
    location: "Kairouan, Tunisia",
    severity: "low",
  },
];

export const archivistExampleQueries = [
  "What were the sponsor feedback from Hackathon 2024?",
  "How much budget did we spend on workshops last year?",
  "What are best practices for organizing technical events?",
  "Which companies have we partnered with?",
];

export const liaisonPalette = ["#06b6d4", "#a855f7", "#ec4899", "#f59e0b", "#10b981"];

export default function Dummy() { return null; }
