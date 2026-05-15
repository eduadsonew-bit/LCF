"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  ChevronRight,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SiteLayout from "@/components/SiteLayout";
import { useState } from "react";

export default function ContactenosPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
    setTimeout(() => setEnviado(false), 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      detail: "3137891319",
      sub: "",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: Mail,
      title: "Correo Electrónico",
      detail: "info@ligacaldense.com",
      sub: "Respuesta en 24 horas",
      gradient: "from-[#fbbf24] to-amber-500",
    },
    {
      icon: MapPin,
      title: "Dirección",
      detail: "Estadio Palogrande, puerta 22 Norte",
      sub: "Manizales, Caldas",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Clock,
      title: "Horario de Atención",
      detail: "Lunes a Viernes 8:00 am a 6:00 pm",
      sub: "Sábado 9:00 am a 12:00 m",
      subHighlight: true,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <SiteLayout showNavigation={false}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center text-sm text-green-200 mb-6">
            <Link href="/" className="flex items-center hover:text-white transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium">Contáctenos</span>
          </nav>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#fbbf24]">Contáctenos</span>
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. No dudes en comunicarte con nosotros.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Información de Contacto */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Información de <span className="text-green-700">Contacto</span>
            </h2>
            <p className="text-gray-600">Múltiples formas de comunicarte con nosotros</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={item.title}
                  className="group bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
                >
                  <CardContent className="p-6 text-center">
                    <div className={"w-14 h-14 rounded-xl bg-gradient-to-br " + item.gradient + " flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-green-700 font-semibold text-sm">{item.detail}</p>
                    {item.subHighlight ? (
                      <p className="text-xs mt-1">
                        <span className="text-green-600 font-bold text-sm">Sábado</span>
                        <span className="text-green-600 font-bold text-sm"> 9:00 am a 12:00 m</span>
                      </p>
                    ) : (
                      <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Formulario de Contacto */}
        <section className="mb-16">
          <Card className="bg-white shadow-xl border-0 overflow-hidden max-w-2xl mx-auto">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Envíanos un Mensaje</h2>
                      <p className="text-gray-500 text-sm">Completa el formulario y te responderemos pronto</p>
                    </div>
                  </div>

                  {enviado && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center font-medium">
                      Mensaje enviado correctamente. Te responderemos pronto.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asunto">Asunto</Label>
                      <Input
                        id="asunto"
                        name="asunto"
                        placeholder="¿En qué podemos ayudarte?"
                        value={formData.asunto}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje</Label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        placeholder="Escribe tu mensaje aquí..."
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm resize-none outline-none"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </form>
                </div>
              </CardContent>
          </Card>
        </section>


      </div>
    </SiteLayout>
  );
}
