"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Filter,
  ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SiteLayout from "@/components/SiteLayout";

interface Tournament {
  id: string;
  name: string;
  image: string | null;
  status: string;
}

export default function TorneosPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch('/api/public/tournaments');
        const data = await res.json();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  // Filtrar torneos por estado e imagen
  const filteredTournaments = tournaments.filter(tournament => {
    return tournament.image && (statusFilter === "all" || tournament.status === statusFilter);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500 text-white border-0">
            Activo
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="bg-blue-500 text-white border-0">
            Próximo
          </Badge>
        );
      case 'finished':
        return (
          <Badge className="bg-gray-400 text-white border-0">
            Finalizado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">{status}</Badge>
        );
    }
  };

  return (
    <SiteLayout showNavigation={false}>
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="text-green-200 hover:text-white transition-colors">
                    Inicio
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-green-300" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">Torneos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Título */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-2">
              <Trophy className="h-6 w-6 text-[#fcd34d]" />
            </div>
            <h1 className="text-4xl font-bold text-[#fcd34d]">Torneos</h1>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Filtro */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center gap-4">
          <Filter className="h-5 w-5 text-green-600" />
          <span className="font-medium text-gray-700">Filtrar por estado:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="upcoming">Próximos</SelectItem>
              <SelectItem value="finished">Finalizados</SelectItem>
            </SelectContent>
          </Select>
          {statusFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              Limpiar filtro
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-[450px] bg-gray-200"></div>
                <div className="p-3 bg-gray-100">
                  <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTournaments.map((tournament) => (
              <Card 
                key={tournament.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500"
              >
                <CardContent className="p-0">
                  {/* Imagen */}
                  <div className="h-[450px] bg-gray-100 overflow-hidden">
                    {tournament.image ? (
                      <img
                        src={tournament.image}
                        alt={tournament.name}
                        className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-white/40" />
                      </div>
                    )}
                  </div>
                  
                  {/* Estado debajo de la imagen */}
                  <div className="p-3 bg-white border-t flex justify-center">
                    {getStatusBadge(tournament.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <Trophy className="h-12 w-12 text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No hay torneos disponibles</h3>
            <p className="text-gray-500 mb-4">
              {statusFilter !== "all"
                ? "No se encontraron torneos con el filtro seleccionado."
                : "Pronto publicaremos nuevos torneos."}
            </p>
            {statusFilter !== "all" && (
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => setStatusFilter("all")}
              >
                Limpiar filtro
              </Button>
            )}
          </div>
        )}

        {/* Contador */}
        {!loading && filteredTournaments.length > 0 && (
          <p className="mt-6 text-center text-gray-500 text-sm">
            Mostrando {filteredTournaments.length} {filteredTournaments.length === 1 ? 'torneo' : 'torneos'}
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
