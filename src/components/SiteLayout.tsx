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
  DialogTrigger,
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

export default function SiteLayout({ children, showNavigation = true }: SiteLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loginPin, setLoginPin] = useState('');
  const [nosotrosOpen, setNosotrosOpen] = useState(false);
  const nosotrosRef = useRef<HTMLDivElement>(null);

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
        window.location.href = '/admin';
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
              <div className="flex items-center gap-3">
                <img 
                  src="https://image2url.com/r2/default/images/1772308448713-bc826408-825f-4bdc-a154-6795cad265de.png" 
                  alt="LCF Logo" 
                  className="w-10 h-10 rounded-lg object-contain"
                />
                <span className="text-xl font-bold">Liga Caldense de Fútbol</span>
              </div>
            </div>

            {/* Síguenos */}
            <div className="flex flex-col items-center lg:items-start">
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-green-200 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-green-200 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

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
                <span>Caldas, Antioquia, Colombia</span>
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
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-green-200 hover:text-white hover:bg-green-800 gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs">Admin</span>
                  </Button>
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
            </div>
            <p>© 2024 LCF - Liga Caldense de Fútbol. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
