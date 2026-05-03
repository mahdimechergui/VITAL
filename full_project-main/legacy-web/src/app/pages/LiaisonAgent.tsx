import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { MessageSquare, Send, Instagram, Mail, Palette, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface GeneratedContent {
  instagram?: string;
  email?: string;
  colors?: string[];
}

export function LiaisonAgent() {
  const [input, setInput] = useState("");
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!input.trim()) return;

    setIsGenerating(true);

    // Simulate AI content generation
    setTimeout(() => {
      setContent({
        instagram: `🚀 Exciting News! 🚀

${input}

Join us for an unforgettable experience! ✨

📅 Save the date and tag a friend who'd love this!
🎯 Limited spots available - register now!

#TPLClub #ISSATKR #TechCommunity #Innovation #Students #Technology #Workshop #Learning

💙 Follow us for more updates!`,
        email: `Subject: Partnership Opportunity - ${input.split(' ').slice(0, 5).join(' ')}

Dear [Company Name] Team,

I hope this message finds you well. I am reaching out on behalf of TPL (Technology & Programming League), the premier technology club at ISSATKR.

We are excited to announce our upcoming initiative: ${input}

WHY PARTNER WITH US?
• Reach 500+ engaged tech students at ISSATKR
• Direct access to future talent in software engineering and IT
• Brand visibility across our social media (2,000+ followers)
• Speaking opportunity at our event (avg. attendance: 80 students)

PARTNERSHIP BENEFITS:
✓ Logo placement on all promotional materials
✓ Booth space at the event
✓ Recognition in social media campaigns
✓ Access to student resumes and portfolios

We would be honored to discuss how we can create a mutually beneficial partnership. TPL has successfully collaborated with companies like [Previous Partners] and consistently delivers high-engagement events.

Would you be available for a brief call next week to explore this opportunity?

Looking forward to your response.

Best regards,
[Your Name]
President, TPL Club
ISSATKR
contact@tplclub.tn`,
        colors: ["#06b6d4", "#a855f7", "#ec4899", "#f59e0b", "#10b981"]
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
            <MessageSquare className="w-8 h-8 text-purple-400" />
          </div>
          <div className="absolute inset-0 bg-purple-400 blur-xl opacity-30"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-purple-400">The Liaison</h1>
          <p className="text-gray-400 mt-1">PR & Content Agent for Branding & Communications</p>
        </div>
      </div>

      {/* Capabilities */}
      <Card className="bg-gray-900 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-400">Capabilities</CardTitle>
          <CardDescription>Multimodal content generation for your club</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <Instagram className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Social Media Posts</h4>
                <p className="text-xs text-gray-400 mt-1">Generate engaging Instagram captions with optimal hashtags</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Sponsorship Emails</h4>
                <p className="text-xs text-gray-400 mt-1">Professional outreach emails tailored to local companies</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
              <Palette className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Color Palettes</h4>
                <p className="text-xs text-gray-400 mt-1">Suggest colors based on TPL branding guidelines</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card className="bg-gray-900 border-purple-500/20">
        <CardHeader>
          <CardTitle>Describe Your Event or Campaign</CardTitle>
          <CardDescription>The Liaison will generate content across multiple formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'We're hosting a 48-hour hackathon focused on AI and sustainability, with prizes worth $2000, happening May 5-7'"
              className="min-h-[120px] bg-gray-800 border-gray-700 focus:border-purple-500"
            />
            <Button
              onClick={handleGenerate}
              className="bg-purple-500 hover:bg-purple-600 text-white w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  Generating Content...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {content && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400">Generated Content</CardTitle>
              <CardDescription>Ready to use across your channels</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="instagram" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="instagram" className="data-[state=active]:bg-purple-500">
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </TabsTrigger>
                  <TabsTrigger value="email" className="data-[state=active]:bg-purple-500">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="data-[state=active]:bg-purple-500">
                    <Palette className="w-4 h-4 mr-2" />
                    Colors
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="instagram" className="mt-4">
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">
                        {content.instagram}
                      </pre>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => navigator.clipboard.writeText(content.instagram || "")}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="mt-4">
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">
                        {content.email}
                      </pre>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => navigator.clipboard.writeText(content.email || "")}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="mt-4">
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400 mb-4">
                      Suggested color palette based on TPL branding guidelines:
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {content.colors?.map((color, index) => (
                        <div key={index} className="space-y-2">
                          <div
                            className="h-24 rounded-lg border-2 border-gray-700 cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => navigator.clipboard.writeText(color)}
                          />
                          <div className="text-center">
                            <div className="text-xs font-mono text-gray-400">{color}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {index === 0 ? "Primary" : index === 1 ? "Secondary" : index === 2 ? "Accent" : "Complement"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-4">
                      💡 Click on any color to copy the hex code
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tips */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-sm">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Be specific with details (dates, prizes, key features) for better content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Instagram posts perform best when posted between 6-9 PM</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Personalize sponsor emails by researching the company first</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
