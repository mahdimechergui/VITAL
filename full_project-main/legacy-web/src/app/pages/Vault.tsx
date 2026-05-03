import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Lock, FileText, Shield, Download, Eye, Upload, Search, Key } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useState } from "react";

const documents = [
  {
    id: 1,
    name: "TechCorp Sponsorship Contract 2026.pdf",
    type: "Contract",
    uploadedBy: "President",
    uploadDate: "Mar 10, 2026",
    size: "2.4 MB",
    encrypted: true,
    accessLevel: "Board Only"
  },
  {
    id: 2,
    name: "Financial Report Q1 2026.xlsx",
    type: "Financial",
    uploadedBy: "Treasurer",
    uploadDate: "Apr 1, 2026",
    size: "850 KB",
    encrypted: true,
    accessLevel: "Board Only"
  },
  {
    id: 3,
    name: "InnovateTN Partnership Agreement.pdf",
    type: "Contract",
    uploadedBy: "Vice President",
    uploadDate: "Feb 20, 2026",
    size: "1.8 MB",
    encrypted: true,
    accessLevel: "Board Only"
  },
  {
    id: 4,
    name: "Member Database Export.csv",
    type: "Database",
    uploadedBy: "Admin",
    uploadDate: "Apr 10, 2026",
    size: "124 KB",
    encrypted: true,
    accessLevel: "President Only"
  },
  {
    id: 5,
    name: "Hackathon 2024 Budget Breakdown.xlsx",
    type: "Financial",
    uploadedBy: "Treasurer",
    uploadDate: "Mar 25, 2024",
    size: "680 KB",
    encrypted: true,
    accessLevel: "Board + Finance"
  }
];

export function Vault() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Contract": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "Financial": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Database": return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getAccessColor = (access: string) => {
    if (access.includes("President Only")) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (access.includes("Board Only")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
            <Lock className="w-8 h-8 text-green-400" />
          </div>
          <div className="absolute inset-0 bg-green-400 blur-xl opacity-30"></div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-green-400">Secure Vault</h1>
          <p className="text-gray-400 mt-1">Encrypted storage for sensitive documents and contracts</p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600 text-gray-900">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Security Info */}
      <Card className="bg-gradient-to-r from-green-900/20 via-cyan-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            End-to-End Encryption Active
          </CardTitle>
          <CardDescription>All documents are encrypted at rest and in transit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50">
              <Key className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-green-400">AES-256 Encryption</h4>
                <p className="text-xs text-gray-400 mt-1">Military-grade encryption for all files</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50">
              <Lock className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-cyan-400">Zero-Knowledge</h4>
                <p className="text-xs text-gray-400 mt-1">Only authorized users can decrypt files</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50">
              <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-purple-400">Audit Trail</h4>
                <p className="text-xs text-gray-400 mt-1">All access attempts are logged</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">47</div>
            <p className="text-xs text-gray-500">All encrypted</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-cyan-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">124 MB</div>
            <p className="text-xs text-gray-500">of 1 GB</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">12</div>
            <p className="text-xs text-gray-500">Active partnerships</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-pink-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Financial Docs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-400">18</div>
            <p className="text-xs text-gray-500">Reports & budgets</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-700"
        />
      </div>

      {/* Documents Table */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle>Encrypted Documents</CardTitle>
          <CardDescription>Secure file storage with access control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-green-500/30 transition-all"
              >
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-200 truncate">{doc.name}</h4>
                    {doc.encrypted && (
                      <Lock className="w-3 h-3 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <Badge className={getTypeColor(doc.type)}>
                      {doc.type}
                    </Badge>
                    <span>Uploaded by {doc.uploadedBy}</span>
                    <span>•</span>
                    <span>{doc.uploadDate}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getAccessColor(doc.accessLevel)}>
                    {doc.accessLevel}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Access Control Info */}
      <Card className="bg-gray-900 border-orange-500/30">
        <CardHeader>
          <CardTitle className="text-sm">Access Levels Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-2">
                President Only
              </Badge>
              <p className="text-xs text-gray-400">Highest security. Only club president can access.</p>
            </div>
            <div>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-2">
                Board Only
              </Badge>
              <p className="text-xs text-gray-400">Restricted to executive board members.</p>
            </div>
            <div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">
                Board + Teams
              </Badge>
              <p className="text-xs text-gray-400">Accessible to board and specific teams.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
