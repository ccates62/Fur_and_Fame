"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ImportantFile {
  id: string;
  name: string;
  description: string;
  category: "legal" | "tax" | "business" | "other";
  fileType: "PDF" | "DOC" | "XLS" | "TXT" | "OTHER";
  downloadUrl?: string;
  filePath?: string;
  dateAdded: string;
  notes?: string;
}

export default function ImportantFilesPage() {
  const [einFilePath, setEinFilePath] = useState<string>("");
  const [articlesFilePath, setArticlesFilePath] = useState<string>("");
  const [dbaFilePath, setDbaFilePath] = useState<string>("");
  const [showPasteInput, setShowPasteInput] = useState<string | null>(null);
  const [customFiles, setCustomFiles] = useState<ImportantFile[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newFile, setNewFile] = useState({
    name: "",
    description: "",
    category: "other" as ImportantFile["category"],
    fileType: "PDF" as ImportantFile["fileType"],
    notes: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load saved file paths and custom files from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEin = localStorage.getItem("einConfirmationFilePath");
      if (savedEin) {
        setEinFilePath(savedEin);
      }
      const savedArticles = localStorage.getItem("articlesOfOrganizationFilePath");
      if (savedArticles) {
        setArticlesFilePath(savedArticles);
      }
      const savedDba = localStorage.getItem("dbaCertificateFilePath");
      if (savedDba) {
        setDbaFilePath(savedDba);
      }
      const savedCustomFiles = localStorage.getItem("customImportantFiles");
      if (savedCustomFiles) {
        try {
          setCustomFiles(JSON.parse(savedCustomFiles));
        } catch (e) {
          console.error("Error loading custom files:", e);
        }
      }
    }
  }, []);

  const saveFilePath = (path: string, type: "ein" | "articles" | "dba") => {
    if (type === "ein") {
      setEinFilePath(path);
      if (typeof window !== "undefined") {
        localStorage.setItem("einConfirmationFilePath", path);
      }
    } else if (type === "articles") {
      setArticlesFilePath(path);
      if (typeof window !== "undefined") {
        localStorage.setItem("articlesOfOrganizationFilePath", path);
      }
    } else {
      setDbaFilePath(path);
      if (typeof window !== "undefined") {
        localStorage.setItem("dbaCertificateFilePath", path);
      }
    }
    setShowPasteInput(null);
    alert("✅ File path saved! The download button will now use this path.");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: "ein" | "articles" | "dba") => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          // Store as data URL for direct access
          const dataUrl = result as string;
          saveFilePath(dataUrl, type);
          alert(`✅ ${file.name} imported successfully!`);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again if needed
    event.target.value = "";
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-detect file type
      const extension = file.name.split('.').pop()?.toUpperCase();
      const fileTypeMap: Record<string, ImportantFile["fileType"]> = {
        'PDF': 'PDF',
        'DOC': 'DOC',
        'DOCX': 'DOC',
        'XLS': 'XLS',
        'XLSX': 'XLS',
        'TXT': 'TXT',
      };
      setNewFile(prev => ({
        ...prev,
        fileType: fileTypeMap[extension || ''] || 'OTHER',
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""), // Use filename without extension if name is empty
      }));
    }
  };

  const handleImportDocument = () => {
    if (!selectedFile || !newFile.name) {
      alert("Please select a file and enter a document name");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        const dataUrl = result as string;
        const newDocument: ImportantFile = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: newFile.name,
          description: newFile.description || `Imported document: ${selectedFile.name}`,
          category: newFile.category,
          fileType: newFile.fileType,
          filePath: dataUrl,
          dateAdded: new Date().toISOString().split('T')[0],
          notes: newFile.notes || undefined,
        };

        const updatedFiles = [...customFiles, newDocument];
        setCustomFiles(updatedFiles);
        if (typeof window !== "undefined") {
          localStorage.setItem("customImportantFiles", JSON.stringify(updatedFiles));
        }

        // Reset form
        setNewFile({
          name: "",
          description: "",
          category: "other",
          fileType: "PDF",
          notes: "",
        });
        setSelectedFile(null);
        setShowImportModal(false);
        alert(`✅ ${newFile.name} imported successfully!`);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const deleteCustomFile = (id: string) => {
    if (confirm("Delete this document?")) {
      const updated = customFiles.filter(f => f.id !== id);
      setCustomFiles(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("customImportantFiles", JSON.stringify(updated));
      }
    }
  };

  const standardFiles: ImportantFile[] = [
    {
      id: "ein-confirmation",
      name: "EIN Confirmation Letter",
      description: "IRS Employer Identification Number confirmation letter for Timberline Collective LLC",
      category: "legal",
      fileType: "PDF",
      filePath: einFilePath || "/files/ein-confirmation-letter.pdf",
      dateAdded: "2025-12-09",
      notes: "EIN: 41-2989148 - Keep this secure and accessible for banking, taxes, and business setup",
    },
    {
      id: "articles-of-organization",
      name: "Articles of Organization",
      description: "Oregon Secretary of State Articles of Organization for Timberline Collective LLC",
      category: "legal",
      fileType: "PDF",
      filePath: articlesFilePath || "/files/articles-of-organization.pdf",
      dateAdded: "2025-12-08",
      notes: "Registry #: 2500020-95 - Official LLC formation document",
    },
    {
      id: "dba-certificate",
      name: "DBA Certificate - Fur and Fame",
      description: "Oregon Secretary of State Assumed Business Name (DBA) certificate for Fur and Fame",
      category: "legal",
      fileType: "PDF",
      filePath: dbaFilePath || "/files/dba-certificate-fur-and-fame.pdf",
      dateAdded: "2025-12-09",
      notes: "Registry #: 250095594 - DBA registration for Fur and Fame under Timberline Collective LLC",
    },
  ];

  const files = [...standardFiles, ...customFiles];

  const getCategoryColor = (category: ImportantFile["category"]) => {
    switch (category) {
      case "legal":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "tax":
        return "bg-green-100 text-green-700 border-green-300";
      case "business":
        return "bg-amber-100 text-amber-700 border-amber-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getFileIcon = (fileType: ImportantFile["fileType"]) => {
    switch (fileType) {
      case "PDF":
        return "📄";
      case "DOC":
        return "📝";
      case "XLS":
        return "📊";
      case "TXT":
        return "📋";
      default:
        return "📎";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📁 Important Files
              </h1>
              <p className="text-gray-600 text-lg">
                Store and access all your important business documents
              </p>
            </div>
            <Link
              href="/accounts"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Import new documents or manage existing files below.
            </p>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow-md text-sm flex items-center gap-2"
            >
              📁 Import New Document
            </button>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-amber-400 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getFileIcon(file.fileType)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{file.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(file.category)}`}>
                      {file.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{file.description}</p>

              {file.notes && (
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-xs text-gray-700">{file.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Added: {new Date(file.dateAdded).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  {file.filePath ? (
                    file.filePath.startsWith("data:") ? (
                      <a
                        href={file.filePath}
                        download={`${file.id}.pdf`}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-md text-sm flex items-center gap-2"
                      >
                        📥 Download
                      </a>
                    ) : (
                      <a
                        href={file.filePath}
                        download
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-md text-sm flex items-center gap-2"
                      >
                        📥 Download
                      </a>
                    )
                  ) : file.downloadUrl ? (
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-md text-sm flex items-center gap-2"
                    >
                      🔗 Open Link
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">File not available</span>
                  )}
                  {customFiles.some(f => f.id === file.id) && (
                    <button
                      onClick={() => deleteCustomFile(file.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-2 rounded-lg transition shadow-md text-sm"
                      title="Delete document"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {files.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center border-2 border-gray-200">
            <span className="text-6xl mb-4 block">📁</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-600 mb-4">
              Add important business documents here for easy access
            </p>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">📁 Import New Document</h2>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setNewFile({ name: "", description: "", category: "other", fileType: "PDF", notes: "" });
                    setSelectedFile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File *
                  </label>
                  <label className="cursor-pointer bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg p-4 flex items-center justify-center hover:bg-blue-100 transition">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">📄</span>
                      {selectedFile ? (
                        <p className="text-sm font-semibold text-blue-700">{selectedFile.name}</p>
                      ) : (
                        <p className="text-sm text-gray-600">Click to select a file</p>
                      )}
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    value={newFile.name}
                    onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                    placeholder="e.g., Operating Agreement, Tax Return 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newFile.description}
                    onChange={(e) => setNewFile({ ...newFile, description: e.target.value })}
                    placeholder="Brief description of the document"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newFile.category}
                      onChange={(e) => setNewFile({ ...newFile, category: e.target.value as ImportantFile["category"] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="legal">Legal</option>
                      <option value="tax">Tax</option>
                      <option value="business">Business</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Type
                    </label>
                    <select
                      value={newFile.fileType}
                      onChange={(e) => setNewFile({ ...newFile, fileType: e.target.value as ImportantFile["fileType"] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="PDF">PDF</option>
                      <option value="DOC">DOC</option>
                      <option value="XLS">XLS</option>
                      <option value="TXT">TXT</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={newFile.notes}
                    onChange={(e) => setNewFile({ ...newFile, notes: e.target.value })}
                    placeholder="Additional notes or reference numbers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleImportDocument}
                  disabled={!selectedFile || !newFile.name}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition shadow-md"
                >
                  ✅ Import Document
                </button>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setNewFile({ name: "", description: "", category: "other", fileType: "PDF", notes: "" });
                    setSelectedFile(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">EIN Information (Click to Copy)</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600"><strong>EIN:</strong></span>
                  <code className="text-sm font-mono text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded" onClick={() => {
                    navigator.clipboard.writeText("41-2989148");
                    alert("✅ Copied: 41-2989148");
                  }}>41-2989148</code>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600"><strong>LLC:</strong></span>
                  <code className="text-sm font-mono text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded" onClick={() => {
                    navigator.clipboard.writeText("Timberline Collective LLC");
                    alert("✅ Copied: Timberline Collective LLC");
                  }}>Timberline Collective LLC</code>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600"><strong>Registry #:</strong></span>
                  <code className="text-sm font-mono text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded" onClick={() => {
                    navigator.clipboard.writeText("2500020-95");
                    alert("✅ Copied: 2500020-95");
                  }}>2500020-95</code>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">File Storage</h3>
              <p className="text-sm text-gray-600">
                Store files in <code className="bg-gray-100 px-1 rounded">public/files/</code><br />
                Update this page to add new files
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

