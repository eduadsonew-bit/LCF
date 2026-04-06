"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Calendar,
  ChevronRight,
  FolderOpen,
  Search,
  File,
  FileDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  size?: string;
}

// Documentos de ejemplo - en producción vendrían de una API
const sampleDocuments: Document[] = [
  {
    id: "1",
    title: "Reglamento General de la Liga 2024",
    type: "Reglamento",
    date: "2024-01-15",
    description: "Reglamento oficial de la Liga Caldense de Fútbol para el año 2024.",
    size: "2.5 MB",
  },
  {
    id: "2",
    title: "Estatutos de la LCF",
    type: "Estatutos",
    date: "2023-06-20",
    description: "Estatutos legales de la Liga Caldense de Fútbol.",
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "Resolución No. 001 - Inscripciones 2024",
    type: "Resolución",
    date: "2024-02-01",
    description: "Resolución sobre el proceso de inscripciones para el año 2024.",
    size: "500 KB",
  },
  {
    id: "4",
    title: "Resolución No. 002 - Fechas de Torneos",
    type: "Resolución",
    date: "2024-02-15",
    description: "Calendario oficial de torneos para la temporada 2024.",
    size: "350 KB",
  },
  {
    id: "5",
    title: "Manual del Jugador",
    type: "Manual",
    date: "2023-08-10",
    description: "Guía con los derechos y deberes de los jugadores inscritos.",
    size: "3.2 MB",
  },
  {
    id: "6",
    title: "Código de Disciplina",
    type: "Reglamento",
    date: "2023-07-05",
    description: "Normas disciplinarias y sanciones aplicables.",
    size: "1.1 MB",
  },
  {
    id: "7",
    title: "Formato de Inscripción de Equipos",
    type: "Formulario",
    date: "2024-01-10",
    description: "Formulario oficial para la inscripción de nuevos equipos.",
    size: "200 KB",
  },
  {
    id: "8",
    title: "Acta de Asamblea General 2023",
    type: "Acta",
    date: "2023-12-15",
    description: "Acta de la asamblea general ordinaria realizada en diciembre.",
    size: "450 KB",
  },
];

export default function DocumentosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("todos");

  // Tipos únicos de documentos
  const documentTypes = ["todos", ...new Set(sampleDocuments.map((doc) => doc.type))];

  // Filtrar documentos
  const filteredDocuments = sampleDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "todos" || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

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
            <p className="text-green-100">Reglamentos, estatutos, resoluciones y formularios oficiales</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Barra de búsqueda y filtros */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por tipo */}
              <div className="flex flex-wrap gap-2">
                {documentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedType === type
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de documentos */}
        <div className="grid gap-3">
          {filteredDocuments.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron documentos</p>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => (
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Descargar</span>
                    </button>
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
          <p className="text-green-200">Liga Caldense de Fútbol &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}
