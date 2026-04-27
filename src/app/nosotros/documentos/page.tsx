import Link from "next/link";
import {
  FileText,
  Download,
  Calendar,
  ChevronRight,
  FolderOpen,
  File,
  FileDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  size?: string;
  fileUrl?: string;
}

const sampleDocuments: Document[] = [
  {
    id: "1",
    title: "Formato Declaraciones y Autorizaciones DT AT PF",
    type: "Formulario",
    date: "2017-08-17",
    description: "Formato oficial de declaraciones y autorizaciones para Directores Técnicos, Asistentes Técnicos y Preparadores Físicos.",
    size: "148 KB",
    fileUrl: "/documentos/formato-declaraciones-autorizaciones.pdf",
  },
  {
    id: "2",
    title: "Estatutos Liga 2025",
    type: "Estatutos",
    date: "2025-01-01",
    description: "Estatutos oficiales de la Liga Caldense de Fútbol vigentes para el año 2025.",
    size: "418 KB",
    fileUrl: "/documentos/estatutos-liga-2025.pdf",
  },
  {
    id: "3",
    title: "Formato de Confidencialidad",
    type: "Formulario",
    date: "2025-01-01",
    description: "Formato oficial de confidencialidad de la Liga Caldense de Fútbol.",
    size: "120 KB",
    fileUrl: "/documentos/formato-confidencialidad.pdf",
  },
  {
    id: "4",
    title: "Reglamento de Competición - RESOL 002-2026",
    type: "Reglamento",
    date: "2026-01-01",
    description: "Reglamento oficial de competición de la Liga Caldense de Fútbol. Resolución N.° 002-2026.",
    size: "307 KB",
    fileUrl: "/documentos/reglamento-competicion-2026.pdf",
  },
  {
    id: "5",
    title: "Ficha Única de Inscripción Autorización Clubes",
    type: "Formulario",
    date: "2025-01-01",
    description: "Formato oficial de ficha única de inscripción y autorización para clubes de la Liga Caldense de Fútbol.",
    size: "367 KB",
    fileUrl: "/documentos/ficha-unica-inscripcion.pdf",
  },
];

export default function DocumentosPage() {

  // Colores para los tipos de documentos
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Reglamento: "bg-green-100 text-green-700",
      Estatutos: "bg-blue-100 text-blue-700",
      Resolución: "bg-amber-100 text-amber-700",
      Manual: "bg-purple-100 text-purple-700",
      Formulario: "bg-cyan-100 text-cyan-700",
      Acta: "bg-rose-100 text-rose-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-3">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Documentos</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <FolderOpen className="h-8 w-8 text-[#fcd34d]" />
              <h1 className="text-3xl font-bold text-[#fcd34d]">Documentos</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Lista de documentos */}
        <div className="grid gap-3">
          {sampleDocuments.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron documentos</p>
              </CardContent>
            </Card>
          ) : (
            sampleDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-4 gap-4">
                    {/* Icono */}
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 truncate">{doc.title}</h3>
                        <Badge className={getTypeColor(doc.type)} variant="secondary">
                          {doc.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm truncate">{doc.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(doc.date).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {doc.size && (
                          <span className="flex items-center">
                            <FileDown className="h-3 w-3 mr-1" />
                            {doc.size}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botón de descarga */}
                    <a
                      href={doc.fileUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Descargar</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info adicional */}
        <div className="mt-8">
          <Card className="bg-green-50 border border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-bold text-gray-800 mb-1">¿No encuentras lo que buscas?</h3>
                <p className="text-gray-600 text-sm">
                  Si necesitas un documento que no está en la lista, puedes solicitarlo
                  contactándonos a través de nuestros canales oficiales.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-200">Liga Caldense de Fútbol &copy; 2026</p>
        </div>
      </footer>
    </div>
  );
}
