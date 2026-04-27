"use client";

import Link from "next/link";
import {
  Users,
  Trophy,
  Target,
  Star,
  Heart,
  Shield,
  Award,
  Flag,
  ChevronRight,
  Home,
  Eye,
  Goal,
  Handshake,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SiteLayout from "@/components/SiteLayout";

export default function NosotrosPage() {
  // Estadísticas de la liga
  const stats = [
    { number: "45+", label: "Equipos Activos", icon: Users },
    { number: "1,200+", label: "Jugadores Registrados", icon: Trophy },
    { number: "150+", label: "Torneos Realizados", icon: Award },
  ];

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
  ];

  return (
    <SiteLayout>
      {/* Header con gradiente verde */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-green-200 mb-6">
            <Link href="/" className="flex items-center hover:text-white transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium">Nosotros</span>
          </nav>

          {/* Título principal */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Conoce Nuestra <span className="text-[#fbbf24]">Historia</span>
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Más de una década promoviendo el fútbol y los valores deportivos en la región caldense.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Sección: Historia */}
        <section className="mb-16">
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Lado decorativo */}
                <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative z-10">
                    <Goal className="h-16 w-16 mb-6 text-[#fbbf24]" />
                    <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
                    <p className="text-green-100">
                      Una tradición de excelencia deportiva que une a la comunidad.
                    </p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-8 md:p-12">
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg leading-relaxed">
                      La <strong className="text-green-700">Liga Caldense de Fútbol (LCF)</strong> nació 
                      hace más de una década con el sueño de crear un espacio donde los amantes del fútbol 
                      pudieran disfrutar de su pasión de manera organizada y profesional en la región de Caldas.
                    </p>
                    <p className="leading-relaxed">
                      Desde nuestros inicios, hemos trabajado incansablemente por promover el deporte como 
                      herramienta de integración social, reuniendo a comunidades enteras alrededor de la 
                      pasión por el fútbol. Lo que comenzó con pocos equipos hoy se ha convertido en una 
                      de las ligas más importantes de la región.
                    </p>
                    <p className="leading-relaxed">
                      A lo largo de los años, hemos formado generaciones de deportistas que llevan en su 
                      corazón los valores del respeto, el compromiso y la excelencia. Cada torneo, cada 
                      partido, cada gol es un reflejo de nuestra dedicación al desarrollo integral del 
                      fútbol caldense.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sección: Misión y Visión */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Misión y <span className="text-green-700">Visión</span>
            </h2>
            <p className="text-gray-600">Los pilares que guían nuestro camino</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Misión */}
            <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Misión</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Promover el fútbol como herramienta de integración social, fomentando valores como 
                    el trabajo en equipo, el respeto, la disciplina y la sana competencia entre todos 
                    los participantes de nuestra comunidad deportiva.
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-green-500 opacity-10 rounded-tl-full" />
              </CardContent>
            </Card>

            {/* Visión */}
            <Card className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-[#fbbf24] to-amber-500" />
                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-amber-500 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Visión</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Ser la liga de fútbol más reconocida de la región, formando deportistas íntegros 
                    y contribuyendo al desarrollo de comunidades saludables y unidas a través del 
                    deporte, siendo referente de excelencia organizativa.
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#fbbf24] opacity-10 rounded-tl-full" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sección: Valores */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Nuestros <span className="text-green-700">Valores</span>
            </h2>
            <p className="text-gray-600">Los principios que nos definen</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((valor, index) => {
              const IconComponent = valor.icon;
              const gradients = [
                "from-green-500 to-green-600",
                "from-[#fbbf24] to-amber-500",
                "from-blue-500 to-blue-600",
                "from-purple-500 to-purple-600",
              ];
              const gradientClass = gradients[index % gradients.length];

              return (
                <Card
                  key={valor.nombre}
                  className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{valor.nombre}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{valor.descripcion}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Sección: Autoridades */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Nuestras <span className="text-green-700">Autoridades</span>
            </h2>
            <p className="text-gray-600">El equipo que lidera nuestra institución</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {autoridades.map((autoridad, index) => {
              const IconComponent = autoridad.icon;
              const gradients = [
                "from-green-500 to-green-600",
                "from-[#fbbf24] to-amber-500",
                "from-blue-500 to-blue-600",
              ];
              const gradientClass = gradients[index % gradients.length];

              return (
                <Card
                  key={autoridad.cargo}
                  className="group bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Barra decorativa superior */}
                    <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />

                    {/* Avatar placeholder */}
                    <div className="pt-8 pb-4 px-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <IconComponent className="h-10 w-10 text-gray-400" />
                      </div>

                      <div className="text-center">
                        <Badge
                          className={`bg-gradient-to-r ${gradientClass} text-white border-0 shadow-sm mb-3`}
                        >
                          {autoridad.cargo}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{autoridad.nombre}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{autoridad.descripcion}</p>
                      </div>
                    </div>

                    {/* Barra decorativa inferior */}
                    <div className={`h-1 bg-gradient-to-r ${gradientClass} opacity-50`} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Sección: Estadísticas */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-green-700 to-green-900 text-white shadow-2xl border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">
                  LCF en <span className="text-[#fbbf24]">Números</span>
                </h2>
                <p className="text-green-100">Nuestra trayectoria respaldada por resultados</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={stat.label} className="text-center group">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-[#fbbf24]" />
                      </div>
                      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                        {stat.number}
                      </div>
                      <div className="text-green-200 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fbbf24]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </Card>
        </section>

        {/* Sección: Lema */}
        <section>
          <Card className="bg-gradient-to-r from-[#fbbf24] to-amber-500 text-gray-900 shadow-2xl border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <CardContent className="p-8 md:p-12 relative z-10 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-800" />
              <blockquote className="text-2xl md:text-3xl font-bold italic mb-4">
                &quot;Uniendo comunidades a través del fútbol&quot;
              </blockquote>
              <p className="text-gray-800 font-medium">— Lema de la Liga Caldense de Fútbol</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </SiteLayout>
  );
}
