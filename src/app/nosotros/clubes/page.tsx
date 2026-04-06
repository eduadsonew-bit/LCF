"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Shield,
  Search,
  MapPin,
  Users,
  Trophy,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Club {
  id: string;
  name: string;
  category: string;
  founded: string;
  location: string;
  players: number;
  trophies: number;
  colors: string[];
}

// Clubes de ejemplo - en producción vendrían de una API
const sampleClubs: Club[] = [
  {
    id: "1",
    name: "Club Deportivo Caldense",
    category: "Primera A",
    founded: "1995",
    location: "Caldas, Antioquia",
    players: 35,
    trophies: 12,
    colors: ["#22c55e", "#ffffff"],
  },
  {
    id: "2",
    name: "Club Atlético La Dorada",
    category: "Primera A",
    founded: "1998",
    location: "La Dorada",
    players: 32,
    trophies: 8,
    colors: ["#eab308", "#000000"],
  },
  {
    id: "3",
    name: "Club Los Andes FC",
    category: "Primera B",
    founded: "2001",
    location: "Manizales",
    players: 28,
    trophies: 5,
    colors: ["#3b82f6", "#ffffff"],
  },
  {
    id: "4",
    name: "Juvenil del Sur",
    category: "Juvenil",
    founded: "2010",
    location: "Chinchiná",
    players: 25,
    trophies: 3,
    colors: ["#ef4444", "#ffffff"],
  },
  {
    id: "5",
    name: "Club Deportivo Riosucio",
    category: "Primera B",
    founded: "2005",
    location: "Riosucio",
    players: 30,
    trophies: 4,
    colors: ["#8b5cf6", "#ffffff"],
  },
  {
    id: "6",
    name: "Escuela de Fútbol Manzanares",
    category: "Juvenil",
    founded: "2015",
    location: "Manzanares",
    players: 22,
    trophies: 2,
    colors: ["#f97316", "#000000"],
  },
  {
    id: "7",
    name: "Club Filandia FC",
    category: "Primera A",
    founded: "2000",
    location: "Filandia",
    players: 33,
    trophies: 7,
    colors: ["#06b6d4", "#ffffff"],
  },
  {
    id: "8",
    name: "Salamina Deportivo",
    category: "Primera B",
    founded: "2003",
    location: "Salamina",
    players: 27,
    trophies: 3,
    colors: ["#84cc16", "#000000"],
  },
  {
    id: "9",
    name: "Club Belalcázar",
    category: "Juvenil",
    founded: "2012",
    location: "Belalcázar",
    players: 20,
    trophies: 1,
    colors: ["#ec4899", "#ffffff"],
  },
  {
    id: "10",
    name: "Anserma FC",
    category: "Primera A",
    founded: "1997",
    location: "Anserma",
    players: 31,
    trophies: 6,
    colors: ["#14b8a6", "#ffffff"],
  },
  {
    id: "11",
    name: "Club Viterbo",
    category: "Primera B",
    founded: "2008",
    location: "Viterbo",
    players: 26,
    trophies: 2,
    colors: ["#f43f5e", "#ffffff"],
  },
  {
    id: "12",
    name: "Escuela Supercampeones",
    category: "Infantil",
    founded: "2018",
    location: "Caldas",
    players: 18,
    trophies: 1,
    colors: ["#a855f7", "#fbbf24"],
  },
];

export default function ClubesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Categorías únicas
  const categories = ["todos", ...new Set(sampleClubs.map((club) => club.category))];

  // Filtrar clubes
  const filteredClubs = sampleClubs.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Colores para las categorías
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Primera A": "bg-green-100 text-green-700",
      "Primera B": "bg-blue-100 text-blue-700",
      "Juvenil": "bg-amber-100 text-amber-700",
      "Infantil": "bg-purple-100 text-purple-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-3">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Clubes</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <Shield className="h-8 w-8 text-[#fcd34d]" />
              <h1 className="text-3xl font-bold text-[#fcd34d]">Clubes</h1>
            </div>
            <p className="text-green-100">Conoce los clubes afiliados a la Liga Caldense de Fútbol</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{sampleClubs.length}</div>
              <div className="text-sm text-gray-600">Clubes Activos</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {sampleClubs.reduce((acc, club) => acc + club.players, 0)}+
              </div>
              <div className="text-sm text-gray-600">Jugadores</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {sampleClubs.reduce((acc, club) => acc + club.trophies, 0)}+
              </div>
              <div className="text-sm text-gray-600">Torneos</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {new Set(sampleClubs.map((c) => c.location)).size}
              </div>
              <div className="text-sm text-gray-600">Municipios</div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de búsqueda y filtros */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar clubes por nombre o municipio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por categoría */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de clubes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClubs.length === 0 ? (
            <div className="col-span-full">
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron clubes</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredClubs.map((club) => (
              <Card
                key={club.id}
                className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Colores del club */}
                  <div className="h-2 flex">
                    <div
                      className="flex-1"
                      style={{ backgroundColor: club.colors[0] }}
                    />
                    <div
                      className="flex-1"
                      style={{ backgroundColor: club.colors[1] || "#ffffff" }}
                    />
                  </div>

                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <Badge className={getCategoryColor(club.category)} variant="secondary">
                        {club.category}
                      </Badge>
                    </div>

                    {/* Nombre */}
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                      {club.name}
                    </h3>

                    {/* Info */}
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{club.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>Fundado en {club.founded}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span className="text-gray-600">{club.players} jugadores</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Trophy className="h-3 w-3 text-amber-500" />
                        <span className="text-gray-600">{club.trophies} títulos</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
