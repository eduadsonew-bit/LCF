"use client";

import { useState, useEffect, useCallback } from "react";
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
  X,
  ZoomIn,
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

interface ImageModal {
  src: string;
  alt: string;
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
  const [modalImage, setModalImage] = useState<ImageModal | null>(null);
  const ITEMS_PER_PAGE = 6;

  const openImage = useCallback((src: string, alt: string) => {
    setModalImage({ src, alt });
    document.body.style.overflow = "hidden";
  }, []);

  const closeImage = useCallback(() => {
    setModalImage(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeImage();
    };
    if (modalImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalImage, closeImage]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/public/news");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const visibleNews = news.slice(0, visibleCount);
  const hasMore = visibleCount < news.length;
  const featuredNews = news.filter((n) => n.featured);

  return (
    <SiteLayout showNavigation={false}>
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center text-sm text-green-200 mb-3">
            <Link href="/" className="flex items-center hover:text-white transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white font-medium">Noticias</span>
          </nav>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[#fcd34d]">Noticias</h1>
            <p className="text-green-200 max-w-2xl mx-auto">
              Mantente informado sobre las ultimas novedades de la Liga Caldense de Futbol
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
              {featuredNews.length > 0 && visibleNews.some((n) => n.featured) && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <Newspaper className="h-6 w-6 text-[#fbbf24]" />
                    <h2 className="text-2xl font-bold text-[#fbbf24]">Destacadas</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {visibleNews
                      .filter((n) => n.featured)
                      .map((item) => (
                        <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white text-gray-800 py-0 gap-0 flex flex-col">
                          <CardContent className="p-6 flex-1">
                            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-green-700 transition-colors text-center">
                              {item.title}
                            </h3>
                            {item.summary && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-3 text-center">{item.summary}</p>
                            )}
                            {!item.summary && item.content && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-3 text-center">
                                {item.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                              </p>
                            )}
                          </CardContent>
                          {item.image && (
                            <div
                              className="relative h-56 overflow-hidden cursor-pointer"
                              onClick={() => openImage(item.image!, item.title)}
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                                <ZoomIn className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
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
                        <p className="text-sm text-gray-600 mb-2 line-clamp-3 text-center">
                          {item.content.replace(/<[^>]*>/g, "").substring(0, 150)}
                        </p>
                      )}
                    </CardContent>
                    {item.image && (
                      <div
                        className="relative h-40 overflow-hidden cursor-pointer"
                        onClick={() => openImage(item.image!, item.title)}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
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
                    Ver mas noticias
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
                Pronto publicaremos nuevas novedades e informacion importante sobre la liga.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal - Manual (no Dialog component) */}
      {modalImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={closeImage}
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
        >
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
            style={{ cursor: "pointer" }}
          >
            <X className="h-7 w-7" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center p-4"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
          >
            <img
              src={modalImage.src}
              alt={modalImage.alt}
              className="max-w-full rounded-lg"
              style={{ maxHeight: "85vh", objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
