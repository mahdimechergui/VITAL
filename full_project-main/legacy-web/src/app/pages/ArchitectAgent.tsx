import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Brain, Send, Calendar, MapPin, DollarSign, Users, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface Suggestion {
  type: string;
  content: string;
  data?: any;
}

export function ArchitectAgent() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsThinking(true);

    // Simulate AI processing
    setTimeout(() => {
      // Mock response based on input
      const mockSuggestions: Suggestion[] = [];

      if (input.toLowerCase().includes("react") || input.toLowerCase().includes("workshop")) {
        mockSuggestions.push(
          {
            type: "date",
            content: "Optimal Date: April 25, 2026 (Friday)",
            data: {
              reasoning: "Avoids mid-term exam week (Apr 12-16) and Easter break. Historical data shows Friday workshops have 23% higher attendance.",
              alternatives: ["May 2, 2026", "May 9, 2026"]
            }
          },
          {
            type: "venue",
            content: "Recommended Venue: Amphitheater B, ISSATKR",
            data: {
              capacity: 80,
              equipment: ["Projector", "Sound System", "Whiteboard"],
              availability: "Available all day",
              bookingCode: "AMPHI-B-042526"
            }
          },
          {
            type: "budget",
            content: "Projected Budget: $450 - $600",
            data: {
              breakdown: {
                "Refreshments": "$200",
                "Materials (stickers, handouts)": "$100",
                "Speaker honorarium": "$150",
                "Contingency": "$50"
              },
              historical: "React Workshop 2025 cost: $520",
              savings: "Consider bulk ordering snacks for 15% discount"
            }
          },
          {
            type: "attendance",
            content: "Expected Attendance: 55-65 participants",
            data: {
              calculation: "Based on: React topic popularity (high), Friday timing (+20%), marketing lead time (2 weeks, optimal)",
              similar: "Angular Workshop 2025: 58 attendees, Vue Workshop 2024: 62 attendees"
            }
          }
        );
      } else {
        mockSuggestions.push({
          type: "general",
          content: "I can help you plan events! Try asking about organizing a workshop, hackathon, or tech talk.",
          data: {
            examples: [
              "Plan a React workshop",
              "Organize a spring hackathon",
              "Schedule a networking event with sponsors"
            ]
          }
        });
      }

      setSuggestions(mockSuggestions);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">The Architect</h1>
          <p className="text-gray-400 mt-1">Strategic Agent for Event Planning & Resource Optimization</p>
        </div>
      </div>

      {/* Capabilities */}
      <Card className="bg-gray-900 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Capabilities</CardTitle>
          <CardDescription>What the Architect can do for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <Calendar className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Smart Scheduling</h4>
                <p className="text-xs text-gray-400 mt-1">Analyzes academic calendar, past attendance, and holidays to suggest optimal dates</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Venue Selection</h4>
                <p className="text-xs text-gray-400 mt-1">Matches event type with ideal rooms at ISSATKR based on capacity and equipment</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <DollarSign className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Budget Forecasting</h4>
                <p className="text-xs text-gray-400 mt-1">Generates cost estimates using historical data from previous similar events</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Attendance Prediction</h4>
                <p className="text-xs text-gray-400 mt-1">Uses ML models trained on past events to predict turnout</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card className="bg-gray-900 border-cyan-500/20">
        <CardHeader>
          <CardTitle>Ask the Architect</CardTitle>
          <CardDescription>Describe your event idea and get strategic recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'I want to plan a React workshop' or 'Organize a spring hackathon'"
              className="flex-1 bg-gray-800 border-gray-700 focus:border-cyan-500"
            />
            <Button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-gray-900"
              disabled={isThinking}
            >
              {isThinking ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-4 h-4" />
                </motion.div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-cyan-400">Strategic Recommendations</h2>
          
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {suggestion.type === "date" && <Calendar className="w-5 h-5 text-cyan-400" />}
                    {suggestion.type === "venue" && <MapPin className="w-5 h-5 text-cyan-400" />}
                    {suggestion.type === "budget" && <DollarSign className="w-5 h-5 text-cyan-400" />}
                    {suggestion.type === "attendance" && <Users className="w-5 h-5 text-cyan-400" />}
                    {suggestion.content}
                  </CardTitle>
                </CardHeader>
                {suggestion.data && (
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      {suggestion.data.reasoning && (
                        <div>
                          <span className="text-gray-400">Reasoning: </span>
                          <span className="text-gray-300">{suggestion.data.reasoning}</span>
                        </div>
                      )}
                      {suggestion.data.alternatives && (
                        <div>
                          <span className="text-gray-400">Alternatives: </span>
                          <span className="text-gray-300">{suggestion.data.alternatives.join(", ")}</span>
                        </div>
                      )}
                      {suggestion.data.capacity && (
                        <div>
                          <span className="text-gray-400">Capacity: </span>
                          <span className="text-gray-300">{suggestion.data.capacity} people</span>
                        </div>
                      )}
                      {suggestion.data.equipment && (
                        <div>
                          <span className="text-gray-400">Equipment: </span>
                          <span className="text-gray-300">{suggestion.data.equipment.join(", ")}</span>
                        </div>
                      )}
                      {suggestion.data.breakdown && (
                        <div>
                          <div className="text-gray-400 mb-2">Budget Breakdown:</div>
                          <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                            {Object.entries(suggestion.data.breakdown).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-300">{key}</span>
                                <span className="text-cyan-400 font-semibold">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {suggestion.data.historical && (
                        <div className="text-xs text-gray-500 italic">
                          📊 {suggestion.data.historical}
                        </div>
                      )}
                      {suggestion.data.calculation && (
                        <div>
                          <span className="text-gray-400">Calculation: </span>
                          <span className="text-gray-300">{suggestion.data.calculation}</span>
                        </div>
                      )}
                      {suggestion.data.examples && (
                        <div>
                          <div className="text-gray-400 mb-2">Try asking:</div>
                          <div className="space-y-1">
                            {suggestion.data.examples.map((ex: string, i: number) => (
                              <button
                                key={i}
                                onClick={() => setInput(ex)}
                                className="block w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
                              >
                                "{ex}"
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
