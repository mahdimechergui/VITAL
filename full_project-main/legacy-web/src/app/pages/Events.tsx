import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar, MapPin, Users, DollarSign, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const events = [
  {
    id: 1,
    name: "React Advanced Workshop",
    date: "April 25, 2026",
    time: "14:00 - 17:00",
    venue: "Amphitheater B, ISSATKR",
    attendees: { registered: 58, capacity: 80 },
    budget: 550,
    status: "confirmed",
    organizer: "Sarah Chen"
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
    organizer: "TPL Board"
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
    organizer: "Dr. Amina Khalil"
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
    organizer: "Career Team"
  }
];

export function Events() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "planning": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "draft": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-gray-400 mt-1">Plan, organize, and track all club events</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-gray-900">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Fill in the details for your event. The Architect agent can help optimize!</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="event-name">Event Name</Label>
                <Input id="event-name" placeholder="e.g., React Workshop" className="bg-gray-800 border-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-date">Date</Label>
                  <Input id="event-date" type="date" className="bg-gray-800 border-gray-700" />
                </div>
                <div>
                  <Label htmlFor="event-time">Time</Label>
                  <Input id="event-time" type="time" className="bg-gray-800 border-gray-700" />
                </div>
              </div>
              <div>
                <Label htmlFor="event-venue">Venue</Label>
                <Input id="event-venue" placeholder="e.g., Amphitheater A" className="bg-gray-800 border-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-capacity">Capacity</Label>
                  <Input id="event-capacity" type="number" placeholder="80" className="bg-gray-800 border-gray-700" />
                </div>
                <div>
                  <Label htmlFor="event-budget">Budget ($)</Label>
                  <Input id="event-budget" type="number" placeholder="500" className="bg-gray-800 border-gray-700" />
                </div>
              </div>
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea 
                  id="event-description" 
                  placeholder="Describe your event..." 
                  className="bg-gray-800 border-gray-700 min-h-[100px]"
                />
              </div>
              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-900 border-gray-700"
        />
        <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
          Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-cyan-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">12</div>
            <p className="text-xs text-gray-500">This semester</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">6</div>
            <p className="text-xs text-gray-500">Ready to go</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">847</div>
            <p className="text-xs text-gray-500">Across all events</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-pink-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-400">$18,450</div>
            <p className="text-xs text-gray-500">Allocated funds</p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        {filteredEvents.map((event) => (
          <Card key={event.id} className="bg-gray-900 border-gray-700 hover:border-cyan-500/30 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{event.name}</CardTitle>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <CardDescription>Organized by {event.organizer}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Date</div>
                    <div className="text-sm font-semibold">{event.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Time</div>
                    <div className="text-sm font-semibold">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <MapPin className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Venue</div>
                    <div className="text-sm font-semibold">{event.venue}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <DollarSign className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Budget</div>
                    <div className="text-sm font-semibold">${event.budget}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {event.attendees.registered} / {event.attendees.capacity} registered
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{
                          width: `${(event.attendees.registered / event.attendees.capacity) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round((event.attendees.registered / event.attendees.capacity) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  Edit Event
                </Button>
                {event.status === "draft" && (
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white ml-auto">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Event
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
