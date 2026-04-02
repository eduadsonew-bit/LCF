"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Table,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StatisticsFile {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  description: string | null;
  createdAt: string;
}

interface SheetData {
  name: string;
  data: Record<string, unknown>[];
  headers: string[];
}

interface FileContent {
  type: 'pdf' | 'excel';
  name: string;
  fileName: string;
  fileData?: string;
  sheets?: SheetData[];
  error?: string;
}

export default function EstadisticasPage() {
  const [files, setFiles] = useState<StatisticsFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<StatisticsFile | null>(null);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [activeSheet, setActiveSheet] = useState(0);
  const [showFileList, setShowFileList] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/public/statistics-files');
        const data = await res.json();
        setFiles(data);

        if (data.length > 0) {
          loadFileContent(data[0]);
        }
      } catch (error) {
        console.error('Error fetching statistics files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const loadFileContent = async (file: StatisticsFile) => {
    setSelectedFile(file);
    setContentLoading(true);
    setActiveSheet(0);

    try {
      const res = await fetch(`/api/public/statistics-files/${file.id}/content`);
      const data = await res.json();
      setFileContent(data);
    } catch (error) {
      console.error('Error loading file content:', error);
    } finally {
      setContentLoading(false);
    }
    setShowFileList(false);
  };

  const handleDownload = () => {
    if (!fileContent?.fileData) return;

    const link = document.createElement('a');
    link.href = fileContent.fileData;
    link.download = fileContent.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderExcelTable = () => {
    if (!fileContent?.sheets || fileContent.sheets.length === 0) {
      return (
        <div className="text-center py-12">
          <FileSpreadsheet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay datos para mostrar</p>
        </div>
      );
    }

    const currentSheet = fileContent.sheets[activeSheet];

    return (
      <div className="space-y-4">
        {fileContent.sheets.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {fileContent.sheets.map((sheet, index) => (
              <Button
                key={index}
                variant={index === activeSheet ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSheet(index)}
                className={index === activeSheet ? "bg-amber-600 hover:bg-amber-700" : "border-amber-500 text-amber-600"}
              >
                <Table className="h-4 w-4 mr-2" />
                {sheet.name}
              </Button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-600 text-white">
                {currentSheet.headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentSheet.data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors`}
                >
                  {currentSheet.headers.map((header, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 border-t border-gray-200 whitespace-nowrap">
                      {String(row[header] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 text-right">
          {currentSheet.data.length} registros encontrados
        </p>
      </div>
    );
  };

  const renderPDFViewer = () => (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
        <FileText className="h-8 w-8 text-amber-600" />
        <div>
          <p className="font-medium text-amber-800">Documento PDF</p>
          <p className="text-sm text-amber-600">El archivo se muestra a continuación</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto border-amber-300 text-amber-700 hover:bg-amber-100"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar
        </Button>
      </div>

      {fileContent.fileData && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <iframe
            src={fileContent.fileData}
            className="w-full h-[70vh]"
            title={fileContent.name}
          />
        </div>
      )}
    </div>
  );

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
            <span className="text-white">Estadísticas</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-1 text-[#fcd34d]">Estadísticas</h1>
            <p className="text-green-100">Tablas de posiciones, goleadores y rendimiento de los torneos</p>
          </div>
          {files.length > 1 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => setShowFileList(!showFileList)}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Archivos ({files.length})
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFileList ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* File list dropdown */}
      {showFileList && files.length > 0 && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => loadFileContent(file)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedFile?.id === file.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {file.fileType === 'pdf' ? (
                      <FileText className="h-5 w-5 text-red-500" />
                    ) : (
                      <FileSpreadsheet className="h-5 w-5 text-amber-500" />
                    )}
                    <span className="font-medium text-sm truncate">{file.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {loading || contentLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ) : fileContent ? (
          <div className="space-y-4">
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {fileContent.type === 'pdf' ? (
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <FileSpreadsheet className="h-6 w-6 text-amber-600" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-bold text-lg text-gray-800">{fileContent.name}</h2>
                      <div className="flex items-center gap-2">
                        <Badge className={fileContent.type === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                          {fileContent.type === 'pdf' ? 'PDF' : 'Excel'}
                        </Badge>
                        <span className="text-sm text-gray-500">{fileContent.fileName}</span>
                      </div>
                    </div>
                  </div>
                  {fileContent.type === 'excel' && (
                    <Button
                      variant="outline"
                      className="border-amber-500 text-amber-600 hover:bg-amber-50"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Excel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                {fileContent.type === 'pdf'
                  ? renderPDFViewer()
                  : fileContent.error
                    ? (
                      <div className="text-center py-12">
                        <FileSpreadsheet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">{fileContent.error}</p>
                        <Button onClick={handleDownload} className="bg-amber-600 hover:bg-amber-700">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar archivo
                        </Button>
                      </div>
                    )
                    : renderExcelTable()
                }
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay archivos de estadísticas</h3>
              <p className="text-gray-500">Los archivos de estadísticas se mostrarán aquí cuando estén disponibles.</p>
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
