"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  FileText,
  Users,
  ArrowRight,
  ChevronRight,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SiteLayout from "@/components/SiteLayout";

interface InfoCard {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  link: string | null;
  linkText: string | null;
  color: string | null;
  createdAt?: string;
}

// Skeleton component for loading state
function CardSkeleton() {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      
      {/* Decorative top bar skeleton */}
      <div className="h-2 bg-gray-200 animate-pulse"></div>
      
      <div className="p-6">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
        
        {/* Date skeleton */}
        <div className="mt-4 h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
      </div>
    </div>
  );
}

export default function NoticiasPage() {
  const [infoCards, setInfoCards] = useState<InfoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchInfoCards = async () => {
      try {
        const res = await fetch('/api/public/infocards');
        const data = await res.json();
        setInfoCards(data);
      } catch (error) {
        console.error('Error fetching info cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfoCards();
  }, []);

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName: string | null) => {
    switch (iconName) {
      case 'trophy':
        return Trophy;
      case 'calendar':
        return Calendar;
      case 'file-text':
        return FileText;
      case 'users':
        return Users;
      default:
        return Trophy;
    }
  };

  // Get gradient class based on index
  const getGradientClass = (index: number) => {
    const gradients = [
      'from-green-400 to-green-600',
      'from-amber-400 to-amber-600',
      'from-blue-400 to-blue-600',
      'from-rose-400 to-rose-600',
      'from-purple-400 to-purple-600',
      'from-teal-400 to-teal-600',
    ];
    return gradients[index % gradients.length];
  };

  // Handle load more
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const visibleCards = infoCards.slice(0, visibleCount);
  const hasMore = visibleCount < infoCards.length;

  return (
    <SiteLayout showNavigation={false}>
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-green-200 mb-3">
            <Link href="/" className="flex items-center hover:text-white transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium">Noticias</span>
          </nav>
          
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#fcd34d]">Noticias</h1>
            <p className="text-green-200 max-w-2xl mx-auto">
              Mantente informado sobre las últimas novedades de la Liga Caldense de Fútbol
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 py-12 text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
        <div className="container mx-auto px-4 relative z-10">
          {loading ? (
            // Skeleton Loading
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : infoCards.length > 0 ? (
            <>
              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleCards.map((card, index) => {
                  const IconComponent = getIconComponent(card.icon);
                  const gradientClass = getGradientClass(index);

                  return (
                    <div
                      key={card.id}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                      {/* Image */}
                      {card.image ? (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-20`}></div>
                        </div>
                      ) : (
                        <div className={`h-48 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                          <IconComponent className="h-16 w-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Decorative top bar */}
                      <div className={`h-2 bg-gradient-to-r ${gradientClass}`}></div>
                      
                      <div className="p-6">
                        {/* Content */}
                        <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2">
                          {card.title}
                        </h3>
                        
                        {/* Date Badge */}
                        {card.createdAt && (
                          <div className="mt-4 flex items-center">
                            <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(card.createdAt)}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {/* Bottom decorative corner */}
                      <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${gradientClass} opacity-10 rounded-tl-full`}></div>
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={handleLoadMore}
                    size="lg"
                    className="bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Ver más noticias
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Showing count */}
              <div className="text-center mt-6 text-green-200 text-sm">
                Mostrando {visibleCards.length} de {infoCards.length} noticias
              </div>
            </>
          ) : (
            // Empty state
            <div className="text-center py-16 bg-white/10 rounded-2xl">
              <Trophy className="h-20 w-20 text-green-200 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-3">No hay noticias disponibles</h3>
              <p className="text-green-200 max-w-md mx-auto">
                Pronto publicaremos nuevas noticias e información importante sobre la liga.
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
