"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Trophy,
  Target,
  Star,
  Shield,
  Award,
  Flag,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Goal,
  Handshake,
  Building2,
  Scale,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Componente de Comisiones expandible
function ComisionesCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const comisiones = [
    {
      nombre: "Comisión Disciplinaria de la Liga",
      descripcion: "Encargada de aplicar el régimen disciplinario de la liga"
    },
    {
      nombre: "Comisión Disciplinaria de Torneos",
      descripcion: "Responsable de la disciplina en los torneos oficiales"
    },
    {
      nombre: "Comisión de Apelaciones",
      descripcion: "Órgano de revisión de decisiones disciplinarias"
    },
    {
      nombre: "Comisión del Estatuto del Jugador",
      descripcion: "Regula el registro y estatus de los jugadores"
    },
    {
      nombre: "Comisión Técnica",
      descripcion: "Supervisa aspectos técnicos y deportivos"
    },
    {
      nombre: "Comisión de Juzgamiento",
      descripcion: "Evalúa y califica el desempeño arbitral"
    },
    {
      nombre: "Comisión de Torneos",
      descripcion: "Organiza y gestiona los torneos oficiales"
    },
    {
      nombre: "Comisión de Fútbol Femenino",
      descripcion: "Promueve y desarrolla el fútbol femenino"
    },
    {
      nombre: "Comisión de Fútbol Playa",
      descripcion: "Desarrolla el fútbol playa en la región"
    },
    {
      nombre: "Comisión de Fútbol Sala",
      descripcion: "Promueve y organiza el fútbol sala"
    }
  ];

  return (
    <div 
      className={`text-center p-6 bg-blue-50 rounded-xl cursor-pointer transition-all duration-300 ${isExpanded ? 'md:col-span-3' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-center gap-2">
        <Users className="h-10 w-10 text-blue-600 mx-auto mb-4" />
      </div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="font-bold text-gray-800">Comisiones</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-blue-600" />
        )}
      </div>
      <p className="text-gray-600 text-sm mb-2">Áreas especializadas</p>
      <p className="text-blue-600 text-xs font-medium">Click para ver más</p>
      
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left animate-in fade-in duration-200">
          {comisiones.map((comision, index) => (
            <div 
              key={index} 
              className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Scale className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{comision.nombre}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{comision.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganizacionPage() {
  // Valores de la liga
  const valores = [
    {
      nombre: "Respeto",
      descripcion: "Valoramos la integridad y el fair play en cada partido.",
      icon: Handshake,
    },
    {
      nombre: "Compromiso",
      descripcion: "Dedicación total al desarrollo del fútbol regional.",
      icon: Target,
    },
    {
      nombre: "Excelencia",
      descripcion: "Buscamos la mejora continua en todo lo que hacemos.",
      icon: Star,
    },
    {
      nombre: "Trabajo en Equipo",
      descripcion: "La unión hace la fuerza dentro y fuera del campo.",
      icon: Users,
    },
  ];

  // Autoridades de la liga
  const autoridades = [
    {
      cargo: "Presidente",
      nombre: "Juan Carlos Rodríguez",
      descripcion: "Liderando la liga con pasión y dedicación desde 2018.",
      icon: Award,
    },
    {
      cargo: "Vicepresidente",
      nombre: "María Fernanda López",
      descripcion: "Apoyando el crecimiento institucional con visión de futuro.",
      icon: Shield,
    },
    {
      cargo: "Secretario General",
      nombre: "Carlos Alberto Martínez",
      descripcion: "Gestionando la administración con eficiencia y transparencia.",
      icon: Flag,
    },
    {
      cargo: "Tesorero",
      nombre: "Andrés Felipe Gómez",
      descripcion: "Administrando los recursos con honestidad y transparencia.",
      icon: Award,
    },
    {
      cargo: "Director Técnico",
      nombre: "Roberto Carlos Herrera",
      descripcion: "Supervisando el aspecto deportivo y técnico de la liga.",
      icon: Trophy,
    },
    {
      cargo: "Director de Comunicaciones",
      nombre: "Laura Patricia Sánchez",
      descripcion: "Conectando la liga con la comunidad y medios.",
      icon: Flag,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-3">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Organización</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <Building2 className="h-8 w-8 text-[#fcd34d]" />
              <h1 className="text-3xl font-bold text-[#fcd34d]">Organización</h1>
            </div>
            <p className="text-green-100">Conoce la estructura organizativa y las autoridades de la liga</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Misión y Visión */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Misión y Visión</h2>
            <p className="text-gray-600">Los pilares que guían nuestro camino</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Misión */}
            <Card className="border-l-4 border-l-green-500 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Nuestra Misión</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Promover el fútbol como herramienta de integración social, fomentando valores como 
                  el trabajo en equipo, el respeto, la disciplina y la sana competencia entre todos 
                  los participantes de nuestra comunidad deportiva.
                </p>
              </CardContent>
            </Card>

            {/* Visión */}
            <Card className="border-l-4 border-l-amber-500 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Nuestra Visión</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Ser la liga de fútbol más reconocida de la región, formando deportistas íntegros 
                  y contribuyendo al desarrollo de comunidades saludables y unidas a través del 
                  deporte, siendo referente de excelencia organizativa.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Valores */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Nuestros Valores</h2>
            <p className="text-gray-600">Los principios que nos definen</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {valores.map((valor, index) => {
              const IconComponent = valor.icon;
              const colors = [
                "bg-green-100 text-green-600",
                "bg-amber-100 text-amber-600",
                "bg-blue-100 text-blue-600",
                "bg-purple-100 text-purple-600",
              ];
              const colorClass = colors[index % colors.length];

              return (
                <Card key={valor.nombre} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-5 text-center">
                    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{valor.nombre}</h3>
                    <p className="text-gray-600 text-sm">{valor.descripcion}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Autoridades */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Nuestras Autoridades</h2>
            <p className="text-gray-600">El equipo que lidera nuestra institución</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {autoridades.map((autoridad, index) => {
              const IconComponent = autoridad.icon;
              const colors = [
                { bg: "bg-green-100", text: "text-green-600", badge: "bg-green-600" },
                { bg: "bg-amber-100", text: "text-amber-600", badge: "bg-amber-600" },
                { bg: "bg-blue-100", text: "text-blue-600", badge: "bg-blue-600" },
              ];
              const colorSet = colors[index % colors.length];

              return (
                <Card key={autoridad.cargo} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-full ${colorSet.bg} flex items-center justify-center`}>
                        <IconComponent className={`h-7 w-7 ${colorSet.text}`} />
                      </div>
                      <div>
                        <Badge className={`${colorSet.badge} text-white mb-1`}>
                          {autoridad.cargo}
                        </Badge>
                        <h3 className="font-bold text-gray-800">{autoridad.nombre}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{autoridad.descripcion}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Estructura Organizativa */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Estructura Organizativa</h2>
            <p className="text-gray-600">Cómo estamos organizados</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <Goal className="h-10 w-10 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-800 mb-2">Asamblea General</h3>
                  <p className="text-gray-600 text-sm">Máximo órgano de gobierno</p>
                </div>
                <div className="text-center p-6 bg-amber-50 rounded-xl">
                  <Shield className="h-10 w-10 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-800 mb-2">Junta Directiva</h3>
                  <p className="text-gray-600 text-sm">Órgano de administración</p>
                </div>
                <ComisionesCard />
              </div>
            </CardContent>
          </Card>
        </section>
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
