"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  FileText,
  ArrowRight,
  ChevronRight,
  Home,
  Newspaper,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SiteLayout from "@/components/SiteLayout";

interface NewsItem {
  id: string;
  title: string;
  content: string | null;
  summary: string | null;
  image: string | null;
  author: string | null;
  published: boolean;
  featured: boolean;
  publishedAt: string | null;
}

// Skeleton component for loading state
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="p-5">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-40 bg-gray-200"></div>
    </div>
  );
}

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/public/news');
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const visibleNews = news.slice(0, visibleCount);
  const hasMore = visibleCount < news.length;

  // Featured news and regular news
  const featuredNews = news.filter(n => n.featured);
  const regularNews = news.filter(n => !n.featured);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : news.length > 0 ? (
            <>
              {/* Featured News Section */}
              {featuredNews.length > 0 && visibleNews.some(n => n.featured) && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <Newspaper className="h-6 w-6 text-[#fbbf24]" />
                    <h2 className="text-2xl font-bold text-[#fbbf24]">Destacadas</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {visibleNews.filter(n => n.featured).map((item) => (
                      <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white text-gray-800 py-0 gap-0 flex flex-col">
                        <CardContent className="p-6 flex-1">
                          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-green-700 transition-colors text-center">
                            {item.title}
                          </h3>
                          {item.summary && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3 text-center">{item.summary}</p>
                          )}
                          {!item.summary && item.content && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-3 text-center">{item.content.replace(/<[^>]*>/g, '').substring(0, 150)}</p>
                          )}
                        </CardContent>
                        {item.image && (
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleNews.map((item) => (
                  <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white text-gray-800 py-0 gap-0 flex flex-col">
                    <CardContent className="p-5 flex-1">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-green-700 transition-colors text-center">
                        {item.title}
                      </h3>
                      {item.summary && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3 text-center">{item.summary}</p>
                      )}
                      {!item.summary && item.content && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3 text-center">{item.content.replace(/<[^>]*>/g, '').substring(0, 150)}</p>
                      )}
                    </CardContent>
                    {item.image && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </Card>
                ))}
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
                Mostrando {visibleNews.length} de {news.length} noticias
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white/10 rounded-2xl">
              <Newspaper className="h-20 w-20 text-green-200 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-3">No hay noticias publicadas</h3>
              <p className="text-green-200 max-w-md mx-auto">
                Pronto publicaremos nuevas novedades e información importante sobre la liga.
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
