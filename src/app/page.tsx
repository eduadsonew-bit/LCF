"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  FileText,
  Newspaper,
  Users,
  Mail,
  Menu,
  X,
  MapPin,
  Clock,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
interface Tournament {
  id: string;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  category: string | null;
  image: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image: string | null;
  eventType: string | null;
}

interface Sponsor {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  tier: string;
}

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  link: string | null;
  linkText: string | null;
}

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image: string;
  category: string | null;
}

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

interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  active: boolean;
  order: number;
}

// Navigation items - SIN CONTACTO
const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Torneos", href: "/torneos" },
  { 
    label: "Programación", 
    href: "/programacion",
    subitems: [
      { label: "Partidos", href: "/programacion" },
      { label: "Estadísticas", href: "/programacion/estadisticas" },
      { label: "Resoluciones", href: "/programacion/resoluciones" },
    ]
  },
  { label: "Noticias", href: "/noticias" },
  { label: "Eventos", href: "/eventos" },
  { label: "Proyectos", href: "/proyectos" },
  { 
    label: "Nosotros", 
    href: "/nosotros",
    subitems: [
      { label: "Organización", href: "/nosotros/organizacion" },
      { label: "Documentos", href: "/nosotros/documentos" },
      { label: "Clubes", href: "/nosotros/clubes" },
    ]
  },
];

// Infinite scroll sponsors carousel
function SponsorsCarousel({ sponsors }: { sponsors: Sponsor[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animRef = useRef<number>(0);
  const setWidthRef = useRef(0);
  const totalCopies = 4;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || sponsors.length === 0) return;

    const updateWidth = () => {
      if (container.scrollWidth > 0) {
        setWidthRef.current = container.scrollWidth / totalCopies;
      }
    };

    const timer = setTimeout(updateWidth, 100);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [sponsors.length]);

  const animate = useCallback(() => {
    const container = scrollRef.current;
    if (!container || sponsors.length === 0 || setWidthRef.current === 0) {
      animRef.current = requestAnimationFrame(animate);
      return;
    }
    offsetRef.current -= 3.5;
    if (Math.abs(offsetRef.current) >= setWidthRef.current) {
      offsetRef.current += setWidthRef.current;
    }
    container.style.transform = 'translateX(' + offsetRef.current + 'px)';
    animRef.current = requestAnimationFrame(animate);
  }, [sponsors.length]);

  useEffect(() => {
    offsetRef.current = 0;
    setWidthRef.current = 0;
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  if (sponsors.length === 0) {
    return (
      <div className="px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#fbbf24]">Nuestros Patrocinadores</h2>
        </div>
        <div className="text-center py-6">
          <Users className="h-12 w-12 text-green-200 mx-auto mb-3" />
          <p className="text-green-100">Pronto anunciaremos nuestros patrocinadores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#fbbf24]">Nuestros Patrocinadores</h2>
      </div>
      <div className="overflow-hidden py-2">
        <div ref={scrollRef} className="flex will-change-transform">
          {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
            <div
              key={sponsor.id + '-' + index}
              className="flex-shrink-0 flex items-center justify-center hover:scale-110 transition-transform p-1 px-3"
            >
              {sponsor.logo ? (
                <div className={"w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center shadow-xl overflow-hidden border relative before:absolute before:inset-0 before:bg-gradient-to-br before:rounded-full before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-tl after:rounded-full after:pointer-events-none " + (sponsor.name.toLowerCase().includes("ron viejo") ? "bg-red-700 border-red-800/60 before:from-white/20 before:via-transparent before:to-transparent after:from-transparent after:via-transparent after:to-black/20" : sponsor.name.toLowerCase().includes("molten") ? "bg-black border-gray-600/60 before:from-white/10 before:via-transparent before:to-transparent after:from-transparent after:via-transparent after:to-gray-800/30" : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 border-gray-300/60 before:from-white/70 before:via-gray-100/30 before:to-transparent after:from-transparent after:via-transparent after:to-white/40")}>
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className={"w-full h-full relative z-10 " + (sponsor.name.toLowerCase().includes("ron viejo") ? "object-cover" : sponsor.name.toLowerCase().includes("molten") ? "object-contain" : sponsor.name.toLowerCase().includes("gatorade") ? "object-contain object-center p-4" : "object-contain p-2 mix-blend-multiply")}
                  />
                </div>
              ) : (
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center shadow-xl border border-gray-300/60 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/70 before:via-gray-100/30 before:to-transparent before:rounded-full before:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-tl after:from-transparent after:via-transparent after:to-white/40 after:rounded-full after:pointer-events-none">
                  <span className="text-green-700 font-bold text-xs md:text-sm text-center px-1 relative z-10">
                    {sponsor.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loginPin, setLoginPin] = useState('');

  // Data states
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournamentsRes, eventsRes, sponsorsRes, carouselRes, newsRes, galleryRes, socialMediaRes] = await Promise.all([
          fetch('/api/public/tournaments'),
          fetch('/api/public/events'),
          fetch('/api/public/sponsors'),
          fetch('/api/public/carousel'),
          fetch('/api/public/news'),
          fetch('/api/public/gallery'),
          fetch('/api/public/social-media'),
        ]);

        const [tournamentsData, eventsData, sponsorsData, carouselData, newsData, galleryData, socialMediaData] = await Promise.all([
          tournamentsRes.json(),
          eventsRes.json(),
          sponsorsRes.json(),
          carouselRes.json(),
          newsRes.json(),
          galleryRes.json(),
          socialMediaRes.json(),
        ]);

        setTournaments(tournamentsData);
        setEvents(eventsData);
        setSponsors(sponsorsData);
        setCarouselSlides(carouselData);
        setNews(newsData);
        setGallery(galleryData);
        setSocialMedia(socialMediaData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (!api || carouselSlides.length === 0) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, carouselSlides.length]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Handle login
  const handleLogin = async () => {
    if (!loginPin.trim()) {
      alert('Por favor ingresa el PIN');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: loginPin }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('lcf_admin_logged_in', 'true');
        sessionStorage.setItem('lcf_admin_user', JSON.stringify(data.user));
        setAdminOpen(false);
        setLoginPin('');
        window.location.href = data.user.role === 'dev' ? '/admin/dev' : '/admin';
      } else {
        if (data.blocked) {
          alert('🔒 ' + data.error);
          setAdminOpen(false);
        } else {
          alert(data.error || 'PIN inválido');
        }
        setLoginPin('');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error al iniciar sesión');
    }
  };

  // Format date time
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="text-white sticky top-0 z-50 shadow-lg bg-gradient-to-b from-green-800 to-green-900">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="https://image2url.com/r2/default/images/1772308448713-bc826408-825f-4bdc-a154-6795cad265de.png" 
              alt="LCF Logo" 
              className="w-12 h-12 rounded-lg object-contain"
            />
            <span className="text-xl font-bold tracking-wide hidden sm:block">Liga Caldense de Fútbol</span>
          </Link>

          <div className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              item.subitems ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger className="flex items-center text-lg font-medium hover:text-green-200 transition-colors outline-none">
                    <span>{item.label}</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-green-800 border-green-700 text-white pt-4 mt-1">
                    {item.subitems.map((subitem, index) => (
                      <DropdownMenuItem key={subitem.label} asChild>
                        <Link
                          href={subitem.href}
                          className={`cursor-pointer hover:bg-green-700 focus:bg-green-700 ${index === 0 ? 'mt-2' : ''}`}
                        >
                          {subitem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-lg font-medium hover:text-green-200 transition-colors"
                >
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 hover:bg-green-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-green-800 border-t border-green-700">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                item.subitems ? (
                  <div key={item.label} className="space-y-1">
                    <span className="block py-2 px-3 text-green-200 font-medium">{item.label}</span>
                    {item.subitems.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        className="flex items-center py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{subitem.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center py-2 px-3 rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 relative overflow-hidden">
        {/* Aurora loading effect */}
        <div className="aurora-loader" />
        
        {loading ? (
          <div className="flex items-center justify-center h-96 relative z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {/* Hero Carousel */}
            <section className="relative w-full">
              {carouselSlides.length > 0 ? (
                <Carousel
                  opts={{ loop: true, align: "start" }}
                  setApi={setApi}
                  className="w-full"
                >
                  <CarouselContent>
                    {carouselSlides.map((slide, index) => (
                      <CarouselItem key={slide.id}>
                        <div className="relative w-full h-64 sm:h-80 md:h-[28rem] lg:h-[32rem] bg-black overflow-hidden">
                          {slide.image && (
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className={`w-full h-full object-cover ${index === 1 ? 'object-top' : 'object-center'}`}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                          <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 text-white">
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 drop-shadow-lg">
                              {slide.title}
                            </h2>
                            {slide.subtitle && (
                              <p className="text-xs sm:text-sm md:text-base text-gray-200 mb-2 drop-shadow-md line-clamp-2">
                                {slide.subtitle}
                              </p>
                            )}
                            {slide.link && slide.linkText && (
                              <Button className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base">
                                {slide.linkText}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 bg-black/50 text-white border-none hover:bg-black/70" />
                  <CarouselNext className="right-4 bg-black/50 text-white border-none hover:bg-black/70" />
                </Carousel>
              ) : (
                <div className="w-full h-48 sm:h-56 md:h-72 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-2">Bienvenido a LCF</h2>
                    <p className="text-xl text-green-100">La mejor liga de fútbol</p>
                  </div>
                </div>
              )}

              {/* Slide indicators */}
              {carouselSlides.length > 1 && (
                <div className="flex justify-center gap-2 py-4 bg-gradient-to-r from-green-700 to-green-600">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        current === index ? "bg-[#fcd34d]" : "bg-white"
                      }`}
                      onClick={() => api?.scrollTo(index)}
                      aria-label={`Ir a slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Sponsors Section */}
            <section className="w-full py-6 bg-gradient-to-br from-green-600 to-green-800 text-white relative z-10 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
              <SponsorsCarousel sponsors={sponsors} />
            </section>

            {/* Tournaments Section */}
            <section className="bg-gradient-to-br from-green-600 to-green-800 py-12 text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#fbbf24]">Nuestros Torneos</h2>
                </div>

                {tournaments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {tournaments.filter(t => t.image).slice(0, 3).map((tournament) => (
                      <div key={tournament.id} className="group flex flex-col items-center">
                        <div 
                          className="relative overflow-hidden border-2 border-white rounded-lg cursor-pointer flex-1 w-full min-h-[450px]"
                          onClick={() => tournament.image && setSelectedImage({src: tournament.image, alt: tournament.name})}
                        >
                          {tournament.image ? (
                            <img
                              src={tournament.image}
                              alt={tournament.name}
                              className="absolute inset-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center rounded-lg">
                              <Trophy className="h-12 w-12 text-white/50" />
                            </div>
                          )}
                        </div>
                        <div className="py-2 text-center">
                          <Badge className={`shadow-sm ${tournament.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600' : tournament.status === 'upcoming' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'} text-white border-0`}>
                            {tournament.status === 'active' ? 'Activo' : tournament.status === 'upcoming' ? 'Próximo' : 'Finalizado'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/10 rounded-xl">
                    <Trophy className="h-16 w-16 text-green-200 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No hay torneos activos</h3>
                    <p className="text-green-100 mt-2">Pronto publicaremos nuevos torneos</p>
                  </div>
                )}
              </div>
            </section>

            {/* Noticias Recientes Section */}
            <section className="bg-gradient-to-br from-green-600 to-green-800 py-16 text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
              <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-[#fbbf24] mb-3">Noticias Recientes</h2>
                  <p className="text-green-100 text-lg max-w-2xl mx-auto">Mantente informado sobre las ultimas novedades de nuestra liga</p>
                </div>

              {news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {news.slice(0, 3).map((item, index) => {
                    const gradients = [
                      "from-green-400 to-green-600",
                      "from-amber-400 to-amber-600",
                      "from-blue-400 to-blue-600",
                    ];
                    const gradientClass = gradients[index % gradients.length];

                    return (
                      <div
                        key={item.id}
                        className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
                      >
                        {/* Decorative top bar */}
                        <div className={"h-2 bg-gradient-to-r " + gradientClass}></div>

                        <CardContent className="p-6 flex-grow flex flex-col">
                          {/* Title */}
                          <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-green-700 transition-colors">
                            {item.title}
                          </h3>
                          {/* Summary / Content */}
                          {(item.summary || item.content) && (
                            <p className="text-sm text-gray-600 mt-3 text-center leading-relaxed line-clamp-4">
                              {item.summary || item.content.replace(/<[^>]*>/g, "")}
                            </p>
                          )}
                          {/* Author */}
                          {item.author && (
                            <div className="text-center mt-3 pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-400">{item.author}</span>
                            </div>
                          )}
                        </CardContent>

                        {/* News image - Bottom */}
                        <div
                          className="relative overflow-hidden bg-gray-100 h-[400px] mt-auto cursor-pointer"
                          onClick={() => item.image && setSelectedImage({src: item.image, alt: item.title})}
                        >
                          {item.image ? (
                            <>
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none"></div>
                            </>
                          ) : (
                            <div className={"w-full h-full bg-gradient-to-br " + gradientClass + " flex items-center justify-center"}>
                              <Newspaper className="h-16 w-16 text-white/50" />
                            </div>
                          )}
                        </div>

                        {/* Bottom decorative corner */}
                        <div className={"absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl " + gradientClass + " opacity-10 rounded-tl-full pointer-events-none"}></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/10 rounded-xl">
                  <Newspaper className="h-16 w-16 text-green-200 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">No hay noticias publicadas</h3>
                  <p className="text-green-100 mt-2">Pronto publicaremos nuevas novedades</p>
                </div>
              )}
              {news.length > 0 && (
                <div className="text-center mt-8">
                  <Link
                    href="/noticias"
                    className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    Ver todas las noticias
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
              </div>
            </section>

            {/* Events Section */}
            <section className="bg-gradient-to-br from-green-600 to-green-800 py-12 text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#fbbf24]">Próximos Eventos</h2>
                </div>

                {events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {events.slice(0, 3).map((event, index) => {
                      // Alternar colores de gradiente
                      const gradients = [
                        'from-green-400 to-green-600',
                        'from-amber-400 to-amber-600',
                        'from-blue-400 to-blue-600',
                      ];
                      const gradientClass = gradients[index % gradients.length];

                      return (
                        <div 
                          key={event.id} 
                          className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full"
                        >
                          {/* Content - Text Centered */}
                          <div className="p-6 flex-grow flex items-center justify-center">
                            {/* Title */}
                            <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-green-700 transition-colors">
                              {event.title}
                            </h3>
                          </div>
                          
                          {/* Event Image - Bottom */}
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
                                <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-10 pointer-events-none`}></div>
                              </>
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                                <Calendar className="h-16 w-16 text-white/50" />
                              </div>
                            )}
                          </div>
                          
                          {/* Bottom decorative corner */}
                          <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${gradientClass} opacity-10 rounded-tl-full pointer-events-none`}></div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/10 rounded-xl">
                    <Calendar className="h-16 w-16 text-green-200 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No hay eventos próximos</h3>
                  </div>
                )}
              </div>
            </section>

            {/* Gallery Section */}
            <section className="bg-gradient-to-br from-green-600 to-green-800 py-12 text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#fbbf24]">Galería</h2>
                </div>
              </div>

              {gallery.length > 0 ? (
                <div className="relative w-full overflow-hidden">
                  {/* Gradient overlays */}
                  <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-green-600 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-green-600 to-transparent z-10 pointer-events-none" />

                  <div className="overflow-hidden py-4">
                    <div
                      className="flex gap-6"
                      style={{
                        animation: 'scrollGallery 30s linear infinite',
                      }}
                    >
                      {[...gallery, ...gallery].map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="flex-shrink-0 relative group overflow-hidden rounded-xl shadow-xl min-w-[350px] h-64"
                        >
                          <img
                            src={item.image}
                            alt={item.title || 'Galería'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                            <p className="text-white text-sm text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="container mx-auto px-4">
                  <div className="text-center py-12 bg-white/10 rounded-xl">
                    <ImageIcon className="h-16 w-16 text-green-200 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No hay imágenes</h3>
                  </div>
                </div>
              )}

              <style jsx global>{`
                @keyframes scrollGallery {
                  0% {
                    transform: translateX(-50%);
                  }
                  100% {
                    transform: translateX(0);
                  }
                }
              `}</style>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-white py-8 bg-gradient-to-b from-green-800 to-green-900 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-between gap-8 text-center lg:text-left">
            {/* Liga Caldense de Fútbol */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-3">
                <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
                  <DialogTrigger asChild>
                    <button className="cursor-pointer hover:opacity-80 transition-opacity">
                      <img 
                        src="https://image2url.com/r2/default/images/1772308448713-bc826408-825f-4bdc-a154-6795cad265de.png" 
                        alt="LCF Logo" 
                        className="w-10 h-10 rounded-lg object-contain"
                      />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Panel de Administración</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="pin">PIN de Acceso</Label>
                        <Input
                          id="pin"
                          type="password"
                          placeholder="Ingresa tu PIN"
                          value={loginPin}
                          onChange={(e) => setLoginPin(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                          className="text-center text-lg tracking-widest"
                        />
                      </div>
                      <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
                        Acceder
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <span className="text-xl font-bold">Liga Caldense de Fútbol</span>
              </div>
            </div>

            {/* Síguenos */}
            {socialMedia.length > 0 && (
            <div className="flex flex-col items-center lg:items-start">
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                {socialMedia.map((sm) => {
                  const platformIcons: Record<string, string> = {
                    facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                    twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                    youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
                    tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
                    whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
                    telegram: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
                  };
                  return (
                    <a key={sm.id} href={sm.url} target="_blank" rel="noopener noreferrer" className="text-green-200 hover:text-white transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d={platformIcons[sm.platform] || platformIcons.facebook} />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>
            )}

            {/* Enlaces Rápidos */}
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-green-200 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link href="/torneos" className="hover:text-white transition-colors">Torneos</Link></li>
                <li><Link href="/programacion" className="hover:text-white transition-colors">Programación</Link></li>
                <li><Link href="/noticias" className="hover:text-white transition-colors">Noticias</Link></li>
              </ul>
            </div>

            {/* Ubicación */}
            <div>
              <h4 className="font-semibold mb-4">Ubicación</h4>
              <div className="flex items-center justify-center lg:justify-start text-green-200 text-sm">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Manizales, Caldas, Colombia</span>
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-green-200 text-sm">
                <li className="flex items-center justify-center lg:justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  contacto@lcf.com
                </li>
                <li className="flex items-center justify-center lg:justify-start">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +57 321 804 8070
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-200 text-sm">
            <p>© 2026 LCF - Liga Caldense de Fútbol. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-black/95 border-none">
          <DialogTitle className="sr-only">{selectedImage?.alt || 'Imagen ampliada'}</DialogTitle>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          {selectedImage && (
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-contain max-h-[90vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
