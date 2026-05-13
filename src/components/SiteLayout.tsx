"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  FileText,
  Users,
  Mail,
  Menu,
  X,
  Settings,
  MapPin,
  ChevronDown,
  Building2,
  FolderOpen,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Navigation items - SIN CONTACTO
const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Torneos", href: "/torneos" },
  { label: "Programación", href: "/programacion" },
  { label: "Noticias", href: "/noticias" },
  { label: "Eventos", href: "/eventos" },
];

// Submenu items for Nosotros
const nosotrosItems = [
  { label: "Organización", href: "/nosotros/organizacion", icon: Building2 },
  { label: "Documentos", href: "/nosotros/documentos", icon: FolderOpen },
  { label: "Clubes", href: "/nosotros/clubes", icon: Shield },
];

interface SiteLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  active: boolean;
  order: number;
}

const platformIcons: Record<string, string> = {
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  telegram: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
};

export default function SiteLayout({ children, showNavigation = true }: SiteLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loginPin, setLoginPin] = useState('');
  const [nosotrosOpen, setNosotrosOpen] = useState(false);
  const nosotrosRef = useRef<HTMLDivElement>(null);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);

  // Fetch social media links
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await fetch('/api/public/social-media');
        if (res.ok) {
          const data = await res.json();
          setSocialLinks(data);
        }
      } catch {
        // silently fail
      }
    };
    fetchSocialLinks();
  }, []);

  // Cerrar menú nosotros al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nosotrosRef.current && !nosotrosRef.current.contains(event.target as Node)) {
        setNosotrosOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      {showNavigation && (
        <nav className="text-white sticky top-0 z-50 shadow-lg bg-green-900">
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
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-lg font-medium hover:text-green-200 transition-colors"
                >
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Nosotros Dropdown - Click en flecha */}
              <div ref={nosotrosRef} className="relative flex items-center">
                <Link
                  href="/nosotros"
                  className="text-lg font-medium hover:text-green-200 transition-colors"
                >
                  <span>Nosotros</span>
                </Link>
                <button
                  onClick={() => setNosotrosOpen(!nosotrosOpen)}
                  className="ml-1 p-1 hover:bg-green-800 rounded transition-colors"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${nosotrosOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {nosotrosOpen && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px]">
                      {nosotrosItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-gray-700 hover:text-green-700"
                          onClick={() => setNosotrosOpen(false)}
                        >
                          <item.icon className="h-5 w-5 text-green-600" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center py-2 px-3 rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}

                {/* Nosotros submenu in mobile */}
                <div className="border-t border-green-600 pt-2 mt-2">
                  <button
                    className="flex items-center justify-between w-full py-2 px-3 text-green-200 font-medium hover:bg-green-700 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const submenu = document.getElementById('nosotros-submenu');
                      if (submenu) {
                        submenu.classList.toggle('hidden');
                      }
                    }}
                  >
                    <span>Nosotros</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div id="nosotros-submenu" className="hidden pl-4 space-y-1 mt-1">
                    {nosotrosItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-green-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-white py-8 bg-green-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-between gap-8 text-center lg:text-left">
            {/* Liga Caldense de Fútbol */}
            <div className="flex flex-col items-center lg:items-start">
              <button
                onClick={() => setAdminOpen(true)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                title="Panel de Administración"
              >
                <img 
                  src="https://image2url.com/r2/default/images/1772308448713-bc826408-825f-4bdc-a154-6795cad265de.png" 
                  alt="LCF Logo" 
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <span className="text-xl font-bold">Liga Caldense de Fútbol</span>
              </button>
            </div>

            {/* Síguenos */}
            {socialLinks.length > 0 && (
              <div className="flex flex-col items-center lg:items-start">
                <h4 className="font-semibold mb-4">Síguenos</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-green-200 hover:text-white transition-colors" title={link.platform}>
                      {platformIcons[link.platform] ? (
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d={platformIcons[link.platform]} />
                        </svg>
                      ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      )}
                    </a>
                  ))}
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
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
            </div>
            <button onClick={() => setAdminOpen(true)} className="hover:text-white transition-colors cursor-pointer">© 2026 LCF - Liga Caldense de Fútbol. Todos los derechos reservados.</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
