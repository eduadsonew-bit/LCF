"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  ChevronRight,
  ImageIcon,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SiteLayout from "@/components/SiteLayout";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image: string | null;
  eventType: string | null;
}

const eventTypes = [
  { value: "all", label: "Todos" },
  { value: "Partido", label: "Partido" },
  { value: "Torneo", label: "Torneo" },
  { value: "Ceremonia", label: "Ceremonia" },
];

// Skeleton component for loading state
const EventSkeleton = () => (
  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-300/60 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-black relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/70 before:via-gray-100/30 before:to-transparent before:rounded-lg before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-tl after:from-transparent after:via-transparent after:to-white/40 after:rounded-lg after:pointer-events-none">
    <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 animate-pulse"></div>
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-20 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-10 h-10 rounded-xl bg-gray-300 animate-pulse"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-300 rounded mb-3 animate-pulse"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div>
      </div>
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="h-8 w-full bg-gray-300 rounded animate-pulse"></div>
        <div className="h-8 w-full bg-gray-300 rounded animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/public/events');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter events by type
  const filteredEvents = selectedFilter === "all"
    ? events
    : events.filter(event => event.eventType === selectedFilter);

  // Get gradient based on event type
  const getGradient = (eventType: string | null, index: number) => {
    const gradients = [
      'from-green-400 to-green-600',
      'from-amber-400 to-amber-600',
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-rose-400 to-rose-600',
    ];
    
    if (eventType === 'Partido') return 'from-green-400 to-green-600';
    if (eventType === 'Torneo') return 'from-amber-400 to-amber-600';
    if (eventType === 'Ceremonia') return 'from-purple-400 to-purple-600';
    
    return gradients[index % gradients.length];
  };

  // Get badge color based on event type
  const getBadgeColor = (eventType: string | null) => {
    if (eventType === 'Partido') return 'bg-gradient-to-r from-green-500 to-green-600';
    if (eventType === 'Torneo') return 'bg-gradient-to-r from-amber-500 to-amber-600';
    if (eventType === 'Ceremonia') return 'bg-gradient-to-r from-purple-500 to-purple-600';
    return 'bg-gradient-to-r from-blue-500 to-blue-600';
  };

  return (
    <SiteLayout showNavigation={false}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 py-6 text-white">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-green-200 mb-3">
            <Link href="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium">Eventos</span>
          </nav>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#fcd34d]">Eventos</h1>
            <p className="text-green-100 mt-2">Mantente informado sobre todos los eventos de la Liga Caldense de Fútbol</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter section */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filtrar:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedFilter === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(type.value)}
                className={selectedFilter === type.value 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "border-green-600 text-green-600 hover:bg-green-50"
                }
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading state with skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {[...Array(6)].map((_, index) => (
              <EventSkeleton key={index} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          /* Events grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredEvents.map((event, index) => {
              const gradientClass = getGradient(event.eventType, index);
              const badgeColor = getBadgeColor(event.eventType);

              return (
                <Card 
                  key={event.id} 
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
                >
                  {/* Decorative top bar */}
                  <div className={`h-2 bg-gradient-to-r ${gradientClass}`}></div>
                  
                  <CardContent className="p-6 flex-grow">
                    {/* Badge and icon row */}
                    <div className="flex items-center justify-between mb-4">
                      {event.eventType && (
                        <Badge className={`${badgeColor} text-white border-0 shadow-sm`}>
                          {event.eventType}
                        </Badge>
                      )}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-green-700 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {event.description}
                    </p>
                    
                    {/* Date and Location */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      {event.date && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientClass} bg-opacity-10 flex items-center justify-center mr-3`}>
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium capitalize">{formatDate(event.date)}</span>
                            <span className="text-xs text-gray-500">{formatTime(event.date)}</span>
                          </div>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientClass} bg-opacity-10 flex items-center justify-center mr-3`}>
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  {/* Event image - Bottom */}
                  <div 
                    className="relative overflow-hidden bg-gray-100 h-[400px] mt-auto cursor-pointer"
                    onClick={() => event.image && setSelectedImage({src: event.image, alt: event.title})}
                  >
                    {event.image ? (
                      <>
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none"></div>
                      </>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                        <Calendar className="h-16 w-16 text-white/50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom decorative corner */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${gradientClass} opacity-10 rounded-tl-full pointer-events-none`}></div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No hay eventos disponibles</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedFilter !== "all" 
                ? `No hay eventos del tipo "${selectedFilter}" en este momento. Pronto publicaremos nuevos eventos.`
                : "Pronto publicaremos nuevos eventos. ¡Mantente atento!"
              }
            </p>
          </div>
        )}

        {/* Event count */}
        {!loading && filteredEvents.length > 0 && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            Mostrando {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}
            {selectedFilter !== "all" && ` del tipo "${selectedFilter}"`}
          </div>
        )}
      </div>

      {/* Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-none">
          <DialogHeader>
            <DialogTitle className="sr-only">{selectedImage?.alt || 'Imagen ampliada'}</DialogTitle>
          </DialogHeader>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
