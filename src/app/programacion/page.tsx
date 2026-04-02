"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  Download,
  FileText,
  ChevronDown,
  FolderOpen,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScheduleFile {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  fileData: string | null;
  description: string | null;
  createdAt: string;
}

export default function ProgramacionPage() {
  const [scheduleFiles, setScheduleFiles] = useState<ScheduleFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFileList, setShowFileList] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ScheduleFile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Convert base64 to blob URL for better performance with large files
  useEffect(() => {
    // Cleanup previous blob URL
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }

    if (!selectedFile?.fileData) {
      return;
    }

    try {
      // Extract the base64 data from data URI
      const base64Data = selectedFile.fileData.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    } catch (error) {
      console.error('Error creating blob URL:', error);
      // Fallback to original data URI
      setBlobUrl(selectedFile.fileData);
    }

    // Cleanup on unmount
    return () => {
      if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [selectedFile?.id, selectedFile?.fileData]);

  useEffect(() => {
    const fetchScheduleFiles = async () => {
      try {
        const res = await fetch('/api/public/schedule-files');
        const data = await res.json();
        
        setScheduleFiles(data);
        
        // Seleccionar el primer archivo por defecto
        if (data.length > 0) {
          setSelectedFile(data[0]);
        }
      } catch (error) {
        console.error('Error fetching schedule files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleFiles();
  }, []);

  const handleDownload = useCallback((file: ScheduleFile) => {
    if (!file.fileData) return;
    
    const link = document.createElement('a');
    link.href = file.fileData;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const selectFile = useCallback((file: ScheduleFile) => {
    setSelectedFile(file);
    setShowFileList(false);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  const filteredFiles = scheduleFiles.filter((file) => {
    return file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
  });

  const renderPDFViewer = () => {
    if (!selectedFile?.fileData) {
      return (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Este documento no tiene archivo adjunto</p>
        </div>
      );
    }

    if (!blobUrl) {
      return (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Cargando documento...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <FileText className="h-8 w-8 text-red-600" />
          <div>
            <p className="font-medium text-red-800">Documento PDF</p>
            <p className="text-sm text-red-600">El archivo se muestra a continuación</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto border-red-300 text-red-700 hover:bg-red-100"
            onClick={() => handleDownload(selectedFile)}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
          <iframe
            src={blobUrl}
            className="w-full h-[75vh]"
            title={selectedFile.name}
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
            <span className="text-white">Programación</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-1 text-[#fcd34d]">Programación de Partidos</h1>
            <p className="text-green-100">Calendario oficial de encuentros deportivos</p>
          </div>
          {scheduleFiles.length > 1 && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => setShowFileList(!showFileList)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Documentos ({scheduleFiles.length})
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFileList ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* File list dropdown */}
      {showFileList && scheduleFiles.length > 0 && (
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
              {filteredFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => selectFile(file)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedFile?.id === file.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-red-500" />
                    <Badge className="bg-red-100 text-red-700 text-xs">PDF</Badge>
                  </div>
                  <span className="font-medium text-sm truncate block">{file.name}</span>
                  <span className="text-xs text-gray-500">{file.fileName}</span>
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
        ) : selectedFile ? (
          <div className="space-y-4">
            {/* Info del archivo seleccionado */}
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-gray-800">{selectedFile.name}</h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-red-100 text-red-700">
                          PDF
                        </Badge>
                        <span className="text-sm text-gray-500">{selectedFile.fileName}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatDate(selectedFile.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {selectedFile.fileData && (
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => handleDownload(selectedFile)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </Button>
                  )}
                </div>
                {selectedFile.description && (
                  <p className="mt-3 text-gray-600 text-sm">{selectedFile.description}</p>
                )}
              </CardContent>
            </Card>

            {/* PDF Viewer */}
            <Card>
              <CardContent className="p-6">
                {renderPDFViewer()}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay programación disponible</h3>
              <p className="text-gray-500">Pronto se publicarán los calendarios de partidos.</p>
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
