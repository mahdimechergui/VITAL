import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Database, Send, FileText, Search, Clock, Tag } from "lucide-react";
import { motion } from "motion/react";

interface SearchResult {
  title: string;
  source: string;
  date: string;
  summary: string;
  relevance: number;
  tags: string[];
}

export function ArchivistAgent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    // Simulate RAG search
    setTimeout(() => {
      let mockResults: SearchResult[] = [];

      if (query.toLowerCase().includes("hackathon") || query.toLowerCase().includes("sponsor")) {
        mockResults = [
          {
            title: "Hackathon 2024 - Sponsor Feedback Summary",
            source: "Meeting Minutes - March 15, 2024",
            date: "March 15, 2024",
            summary: "Sponsors from TechCorp and InnovateTN provided overwhelmingly positive feedback. TechCorp appreciated the quality of student projects (8.5/10 rating) and expressed interest in recruiting 3 finalists. InnovateTN mentioned the event was well-organized but suggested extending networking time by 30 minutes. Both sponsors committed to returning for 2025 with increased sponsorship budgets (+25%).",
            relevance: 95,
            tags: ["Hackathon", "Sponsors", "Feedback", "2024"]
          },
          {
            title: "Hackathon 2024 - Financial Report",
            source: "Financial Documents - March 20, 2024",
            date: "March 20, 2024",
            summary: "Total sponsorship received: $8,500 (TechCorp: $5,000, InnovateTN: $2,500, Local businesses: $1,000). Total expenses: $7,200. Breakdown: Prizes ($4,000), Food & beverages ($2,000), Marketing ($600), Venue & equipment ($600). Net surplus: $1,300 allocated to club reserve fund.",
            relevance: 88,
            tags: ["Hackathon", "Budget", "Sponsors", "2024"]
          },
          {
            title: "Sponsor Outreach Strategy 2024",
            source: "Strategic Plan PDF",
            date: "January 10, 2024",
            summary: "Key learnings from previous sponsor relationships: Emphasize ROI (recruitment access, brand visibility). TechCorp values hands-on interaction with students. InnovateTN prefers speaking slots over booth-only presence. Recommendation: Create tiered sponsorship packages (Bronze/Silver/Gold) with clear deliverables.",
            relevance: 82,
            tags: ["Sponsors", "Strategy", "Planning"]
          }
        ];
      } else if (query.toLowerCase().includes("workshop") || query.toLowerCase().includes("react")) {
        mockResults = [
          {
            title: "React Workshop - January 2025 Retrospective",
            source: "Event Report",
            date: "February 5, 2025",
            summary: "62 attendees (85% attendance rate from registrations). Post-event survey: 4.7/5 satisfaction. Participants particularly enjoyed hands-on coding sessions. Suggestion for improvement: Provide prerequisite materials 1 week in advance. Speaker (Sarah from TechCorp) received excellent reviews and willing to return.",
            relevance: 92,
            tags: ["Workshop", "React", "2025", "Feedback"]
          },
          {
            title: "Technical Workshop Best Practices",
            source: "TPL Guidelines Document",
            date: "September 2024",
            date: "September 2024",
            summary: "Based on 3 years of workshops: Optimal duration is 3 hours with 2 breaks. Provide setup instructions 48 hours prior. Keep groups to 4-5 for collaborative exercises. Budget $8-10 per attendee for refreshments. Always have backup Wi-Fi solution.",
            relevance: 75,
            tags: ["Workshop", "Guidelines", "Best Practices"]
          }
        ];
      } else {
        mockResults = [
          {
            title: "TPL Club Overview 2024-2025",
            source: "Annual Report",
            date: "October 1, 2024",
            summary: "TPL achieved record membership: 156 active members. Successfully organized 12 major events with average attendance of 65 students. Established partnerships with 5 companies. Club satisfaction rating: 4.6/5. Key focus areas: AI/ML workshops, hackathons, career development.",
            relevance: 70,
            tags: ["Overview", "Annual Report", "Statistics"]
          }
        ];
      }

      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const exampleQueries = [
    "What were the sponsor feedback from Hackathon 2024?",
    "How much budget did we spend on workshops last year?",
    "What are best practices for organizing technical events?",
    "Which companies have we partnered with?"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="p-4 bg-pink-500/10 rounded-xl border border-pink-500/30">
            <Database className="w-8 h-8 text-pink-400" />
          </div>
          <div className="absolute inset-0 bg-pink-400 blur-xl opacity-30"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-pink-400">The Archivist</h1>
          <p className="text-gray-400 mt-1">Memory Agent with RAG for Institutional Knowledge</p>
        </div>
      </div>

      {/* Capabilities */}
      <Card className="bg-gray-900 border-pink-500/20">
        <CardHeader>
          <CardTitle className="text-pink-400">How It Works</CardTitle>
          <CardDescription>Retrieval-Augmented Generation for club history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800/50 border border-pink-500/20">
              <FileText className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Document Ingestion</h4>
                <p className="text-xs text-gray-400">The Archivist has access to all meeting minutes, event reports, financial documents, and strategic plans stored in the system.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800/50 border border-pink-500/20">
              <Search className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Semantic Search</h4>
                <p className="text-xs text-gray-400">Uses vector embeddings to find relevant information based on meaning, not just keywords. Understands context and relationships between documents.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800/50 border border-pink-500/20">
              <Database className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Intelligent Summarization</h4>
                <p className="text-xs text-gray-400">Combines multiple sources and generates concise summaries, citing exact documents and dates for verification.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Form */}
      <Card className="bg-gray-900 border-pink-500/20">
        <CardHeader>
          <CardTitle>Ask the Archivist</CardTitle>
          <CardDescription>Search through club history and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'What were the sponsor feedback from Hackathon 2024?'"
                className="flex-1 bg-gray-800 border-gray-700 focus:border-pink-500"
              />
              <Button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white"
                disabled={isSearching}
              >
                {isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Search className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Example Queries */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Try these example queries:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setQuery(example)}
                    className="text-left text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:border-pink-500/30 transition-all"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-pink-400">
              Found {results.length} relevant {results.length === 1 ? "document" : "documents"}
            </h2>
            <div className="text-sm text-gray-400">Sorted by relevance</div>
          </div>

          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-900 border-pink-500/20 hover:border-pink-500/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-pink-400 mb-2">
                        {result.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {result.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-pink-400">{result.relevance}%</div>
                      <div className="text-xs text-gray-500">relevance</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    {result.summary}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-3 h-3 text-gray-500" />
                    {result.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Info Box */}
      <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30">
        <CardHeader>
          <CardTitle className="text-sm">📚 Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-pink-400">247</div>
              <div className="text-xs text-gray-400">Documents Indexed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">3 years</div>
              <div className="text-xs text-gray-400">Historical Data</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">1,832</div>
              <div className="text-xs text-gray-400">Total Queries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">96%</div>
              <div className="text-xs text-gray-400">Accuracy Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
