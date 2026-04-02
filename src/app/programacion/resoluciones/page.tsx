"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  Download,
  Search,
  FolderOpen,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Resolution {
  id: string;
  title: string;
  type: string;
  number: string;
  description: string | null;
  fileUrl: string | null;
  fileData: string | null;
  fileName: string | null;
  fileType: string | null;
  date: string;
}

export default function ResolucionesPage() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResolution, setSelectedResolution] = useState<Resolution | null>(null);
  const [showFileList, setShowFileList] = useState(false);

  useEffect(() => {
    const fetchResolutions = async () => {
      try {
        const res = await fetch('/api/public/resolutions');
        const data = await res.json();
        setResolutions(data);

        if (data.length > 0) {
          setSelectedResolution(data[0]);
        }
      } catch (error) {
        console.error('Error fetching resolutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResolutions();
  }, []);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "reglamento": "bg-purple-100 text-purple-800 border-purple-200",
      "resolucion": "bg-blue-100 text-blue-800 border-blue-200",
      "circular": "bg-green-100 text-green-800 border-green-200",
      "acta": "bg-amber-100 text-amber-800 border-amber-200",
      "calendario": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "sancion": "bg-red-100 text-red-800 border-red-200",
      "protocolo": "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      "reglamento": "Reglamento",
      "resolucion": "Resolución",
      "circular": "Circular",
      "acta": "Acta",
      "calendario": "Calendario",
      "sancion": "Sanción",
      "protocolo": "Protocolo",
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const filteredResolutions = resolutions.filter((res) => {
    return res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           res.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (res.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
  });

  const handleDownload = (resolution: Resolution) => {
    if (resolution.fileData) {
      const link = document.createElement('a');
      link.href = resolution.fileData;
      link.download = resolution.fileName || `${resolution.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resolution.fileUrl) {
      window.open(resolution.fileUrl, '_blank');
    }
  };

  const selectResolution = (resolution: Resolution) => {
    setSelectedResolution(resolution);
    setShowFileList(false);
  };

  const renderPDFViewer = () => {
    if (!selectedResolution?.fileData) {
      return (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Este documento no tiene archivo adjunto</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">Documento PDF</p>
            <p className="text-sm text-blue-600">El archivo se muestra a continuación</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => handleDownload(selectedResolution)}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <iframe
            src={selectedResolution.fileData}
            className="w-full h-[70vh]"
            title={selectedResolution.title}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-3">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/programacion" className="hover:text-white">Programación</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Resoluciones</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-1 text-[#fcd34d]">Resoluciones</h1>
            <p className="text-green-100">Documentos oficiales, circulares y comunicados</p>
          </div>
          {resolutions.length > 1 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => setShowFileList(!showFileList)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Documentos ({resolutions.length})
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFileList ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* File list dropdown */}
      {showFileList && resolutions.length > 0 && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
              {filteredResolutions.map((resolution) => (
                <button
                  key={resolution.id}
                  onClick={() => selectResolution(resolution)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedResolution?.id === resolution.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <Badge className={`${getTypeColor(resolution.type)} text-xs`}>
                      {getTypeLabel(resolution.type)}
                    </Badge>
                  </div>
                  <span className="font-medium text-sm truncate block">{resolution.title}</span>
                  <span className="text-xs text-gray-500">{resolution.number}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ) : selectedResolution ? (
          <div className="space-y-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-gray-800">{selectedResolution.title}</h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getTypeColor(selectedResolution.type)}>
                          {getTypeLabel(selectedResolution.type)}
                        </Badge>
                        <span className="text-sm text-gray-500">{selectedResolution.number}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatDate(selectedResolution.date)}</span>
                      </div>
                    </div>
                  </div>
                  {selectedResolution.fileData && (
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={() => handleDownload(selectedResolution)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </Button>
                  )}
                </div>
                {selectedResolution.description && (
                  <p className="mt-3 text-gray-600 text-sm">{selectedResolution.description}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                {renderPDFViewer()}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay resoluciones disponibles</h3>
              <p className="text-gray-500">Los documentos oficiales se mostrarán aquí cuando estén disponibles.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-200">Liga Caldense de Fútbol &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}
