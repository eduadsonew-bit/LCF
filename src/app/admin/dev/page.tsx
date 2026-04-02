"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Building,
  Layout,
  Shield,
  Users,
  Settings,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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

interface Match {
  id: string;
  tournamentId: string | null;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  matchDate: string | null;
  venue: string | null;
  status: string;
  tournament?: { name: string } | null;
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
  active: boolean;
  order: number;
}

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  link: string | null;
  linkText: string | null;
  order: number;
  active: boolean;
}

interface InfoCard {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  link: string | null;
  linkText: string | null;
  color: string | null;
  order: number;
  active: boolean;
}

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image: string;
  category: string | null;
  order: number;
  active: boolean;
}

interface UserInfo {
  name: string;
  role: string;
}

interface LoginAttempt {
  id: string;
  ipAddress: string;
  attempts: number;
  blockedUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

type EditableItem = Tournament | Match | NewsItem | Event | Sponsor | CarouselSlide | InfoCard | GalleryItem;

const allTabs = [
  { value: "torneos", label: "Torneos", icon: Trophy },
  { value: "partidos", label: "Partidos", icon: Calendar },
  { value: "noticias", label: "Noticias", icon: FileText },
  { value: "eventos", label: "Eventos", icon: Calendar },
  { value: "patrocinadores", label: "Patrocinadores", icon: Building },
  { value: "carrusel", label: "Carrusel", icon: Layout },
  { value: "infocards", label: "Info Cards", icon: FileText },
  { value: "galeria", label: "Galería", icon: ImageIcon },
  { value: "organizacion", label: "Organización", icon: Shield },
  { value: "documentos", label: "Documentos", icon: FileText },
  { value: "clubes", label: "Clubes", icon: Users },
  { value: "seguridad", label: "Seguridad", icon: Shield },
];

export default function DevAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("torneos");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [infoCards, setInfoCards] = useState<InfoCard[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EditableItem | null>(null);
  const [editForm, setEditForm] = useState<Record<string, unknown>>({});
  const [addForm, setAddForm] = useState<Record<string, unknown>>({});
  const [selectedType, setSelectedType] = useState<string>("");

  // Fetch data function
  const fetchAllData = async () => {
    try {
      const [tournamentsRes, matchesRes, newsRes, eventsRes, sponsorsRes, carouselRes, cardsRes, galleryRes, loginAttemptsRes] = await Promise.all([
        fetch('/api/public/tournaments'),
        fetch('/api/public/matches'),
        fetch('/api/public/news'),
        fetch('/api/public/events'),
        fetch('/api/public/sponsors'),
        fetch('/api/public/carousel'),
        fetch('/api/public/infocards'),
        fetch('/api/public/gallery'),
        fetch('/api/auth/login-attempts'),
      ]);

      setTournaments(await tournamentsRes.json());
      setMatches(await matchesRes.json());
      setNews(await newsRes.json());
      setEvents(await eventsRes.json());
      setSponsors(await sponsorsRes.json());
      setCarouselSlides(await carouselRes.json());
      setInfoCards(await cardsRes.json());
      setGalleryItems(await galleryRes.json());
      setLoginAttempts(await loginAttemptsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const loggedIn = sessionStorage.getItem('lcf_admin_logged_in');
      const userData = sessionStorage.getItem('lcf_admin_user');

      if (loggedIn !== 'true' || !userData) {
        router.push('/');
        return;
      }

      try {
        const userInfo = JSON.parse(userData);
        if (userInfo.role !== 'dev') {
          router.push('/admin');
          return;
        }
        setUser(userInfo);
      } catch {
        router.push('/');
        return;
      }

      await fetchAllData();
      setLoading(false);
    };
    init();
  }, [router]);

  // Open edit dialog
  const openEditDialog = (item: EditableItem, type: string) => {
    setSelectedItem(item);
    setSelectedType(type);
    setEditForm({ ...item });
    setEditDialogOpen(true);
  };

  // Open add dialog
  const openAddDialog = (type: string) => {
    setSelectedType(type);
    const defaults: Record<string, Record<string, unknown>> = {
      tournament: { status: 'active', category: 'Adulto' },
      match: { status: 'scheduled', homeTeam: '', awayTeam: '' },
      news: { published: false, featured: false },
      event: { eventType: 'partido' },
      sponsor: { tier: 'bronze', active: true, order: 0 },
      carousel: { order: 0, active: true },
      infocard: { order: 0, active: true, color: 'green', icon: 'trophy' },
      gallery: { order: 0, active: true, image: '' },
    };
    setAddForm(defaults[type] || {});
    setAddDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (item: EditableItem, type: string) => {
    setSelectedItem(item);
    setSelectedType(type);
    setDeleteDialogOpen(true);
  };

  // Handle edit save
  const handleEditSave = async () => {
    if (!selectedItem) return;
    const id = (selectedItem as { id: string }).id;

    try {
      const res = await fetch(`/api/admin/${selectedType}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        setEditDialogOpen(false);
        fetchAllData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error al guardar');
    }
  };

  // Handle add save
  const handleAddSave = async () => {
    try {
      const res = await fetch(`/api/admin/${selectedType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      if (res.ok) {
        setAddDialogOpen(false);
        fetchAllData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al crear');
      }
    } catch (error) {
      console.error('Error creating:', error);
      alert('Error al crear');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedItem) return;
    const id = (selectedItem as { id: string }).id;

    try {
      const res = await fetch(`/api/admin/${selectedType}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteDialogOpen(false);
        fetchAllData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar');
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('lcf_admin_logged_in');
    sessionStorage.removeItem('lcf_admin_user');
    router.push('/');
  };

  // Handle unblock IP
  const handleUnblockIp = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas desbloquear esta IP?')) return;
    
    try {
      const res = await fetch(`/api/auth/login-attempts?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAllData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al desbloquear IP');
      }
    } catch (error) {
      console.error('Error unblocking IP:', error);
      alert('Error al desbloquear IP');
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render security tab
  const renderSecurityTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Intentos de Login Fallidos
        </h2>
        <p className="text-gray-500 mb-6">
          Registro de direcciones IP con intentos de acceso fallidos. Las IPs bloqueadas no podrán intentar iniciar sesión durante 30 minutos.
        </p>

        {loginAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Dirección IP</th>
                  <th className="text-center py-3 px-4 font-semibold">Intentos</th>
                  <th className="text-center py-3 px-4 font-semibold">Estado</th>
                  <th className="text-center py-3 px-4 font-semibold">Bloqueado hasta</th>
                  <th className="text-center py-3 px-4 font-semibold">Último intento</th>
                  <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loginAttempts.map((attempt) => {
                  const isBlocked = attempt.blockedUntil && new Date(attempt.blockedUntil) > new Date();
                  return (
                    <tr key={attempt.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{attempt.ipAddress}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${attempt.attempts >= 3 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {attempt.attempts}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isBlocked ? (
                          <Badge className="bg-red-500">Bloqueado</Badge>
                        ) : attempt.attempts > 0 ? (
                          <Badge className="bg-yellow-500">Alerta</Badge>
                        ) : (
                          <Badge className="bg-green-500">Normal</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {isBlocked ? formatDate(attempt.blockedUntil) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-500">
                        {formatDate(attempt.updatedAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnblockIp(attempt.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Desbloquear
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay registros de intentos fallidos</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render form fields
  const renderFormFields = (form: Record<string, unknown>, setForm: (form: Record<string, unknown>) => void, type: string) => {
    const handleChange = (field: string, value: unknown) => {
      setForm({ ...form, [field]: value });
    };

    switch (type) {
      case 'tournament':
        return (
          <>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.name as string || ''} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description as string || ''} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Input type="date" value={form.startDate as string || ''} onChange={(e) => handleChange('startDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Input type="date" value={form.endDate as string || ''} onChange={(e) => handleChange('endDate', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.status as string || 'active'} onValueChange={(v) => handleChange('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="upcoming">Próximo</SelectItem>
                    <SelectItem value="finished">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={form.category as string || 'Adulto'} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adulto">Adulto</SelectItem>
                    <SelectItem value="Juvenil">Juvenil</SelectItem>
                    <SelectItem value="Infantil">Infantil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
            </div>
          </>
        );
      case 'match':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Equipo Local</Label>
                <Input value={form.homeTeam as string || ''} onChange={(e) => handleChange('homeTeam', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Equipo Visitante</Label>
                <Input value={form.awayTeam as string || ''} onChange={(e) => handleChange('awayTeam', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Goles Local</Label>
                <Input type="number" value={form.homeScore as number || ''} onChange={(e) => handleChange('homeScore', parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Goles Visitante</Label>
                <Input type="number" value={form.awayScore as number || ''} onChange={(e) => handleChange('awayScore', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha del Partido</Label>
                <Input type="datetime-local" value={form.matchDate as string || ''} onChange={(e) => handleChange('matchDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.status as string || 'scheduled'} onValueChange={(v) => handleChange('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Programado</SelectItem>
                    <SelectItem value="live">En Vivo</SelectItem>
                    <SelectItem value="finished">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sede</Label>
              <Input value={form.venue as string || ''} onChange={(e) => handleChange('venue', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Torneo</Label>
              <Select value={form.tournamentId as string || ''} onValueChange={(v) => handleChange('tournamentId', v)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar torneo" /></SelectTrigger>
                <SelectContent>
                  {tournaments.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'news':
        return (
          <>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title as string || ''} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Resumen</Label>
              <Textarea value={form.summary as string || ''} onChange={(e) => handleChange('summary', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <Textarea className="min-h-32" value={form.content as string || ''} onChange={(e) => handleChange('content', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Autor</Label>
              <Input value={form.author as string || ''} onChange={(e) => handleChange('author', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={form.published as boolean || false} onCheckedChange={(v) => handleChange('published', v)} />
                <Label>Publicado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.featured as boolean || false} onCheckedChange={(v) => handleChange('featured', v)} />
                <Label>Destacado</Label>
              </div>
            </div>
          </>
        );
      case 'event':
        return (
          <>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title as string || ''} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description as string || ''} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input type="datetime-local" value={form.date as string || ''} onChange={(e) => handleChange('date', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Evento</Label>
                <Select value={form.eventType as string || 'partido'} onValueChange={(v) => handleChange('eventType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partido">Partido</SelectItem>
                    <SelectItem value="torneo">Torneo</SelectItem>
                    <SelectItem value="ceremonia">Ceremonia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Input value={form.location as string || ''} onChange={(e) => handleChange('location', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
            </div>
          </>
        );
      case 'sponsor':
        return (
          <>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.name as string || ''} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL del Logo</Label>
              <Input value={form.logo as string || ''} onChange={(e) => handleChange('logo', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Sitio Web</Label>
              <Input value={form.website as string || ''} onChange={(e) => handleChange('website', e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nivel</Label>
                <Select value={form.tier as string || 'bronze'} onValueChange={(v) => handleChange('tier', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Oro</SelectItem>
                    <SelectItem value="silver">Plata</SelectItem>
                    <SelectItem value="bronze">Bronce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.order as number || 0} onChange={(e) => handleChange('order', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active as boolean || false} onCheckedChange={(v) => handleChange('active', v)} />
              <Label>Activo</Label>
            </div>
          </>
        );
      case 'carousel':
        return (
          <>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title as string || ''} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input value={form.subtitle as string || ''} onChange={(e) => handleChange('subtitle', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Enlace</Label>
                <Input value={form.link as string || ''} onChange={(e) => handleChange('link', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Texto del Enlace</Label>
                <Input value={form.linkText as string || ''} onChange={(e) => handleChange('linkText', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.order as number || 0} onChange={(e) => handleChange('order', parseInt(e.target.value))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.active as boolean || false} onCheckedChange={(v) => handleChange('active', v)} />
                <Label>Activo</Label>
              </div>
            </div>
          </>
        );
      case 'infocard':
        return (
          <>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title as string || ''} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description as string || ''} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icono</Label>
                <Select value={form.icon as string || 'trophy'} onValueChange={(v) => handleChange('icon', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trophy">Trofeo</SelectItem>
                    <SelectItem value="calendar">Calendario</SelectItem>
                    <SelectItem value="file-text">Documento</SelectItem>
                    <SelectItem value="users">Usuarios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={form.color as string || 'green'} onValueChange={(v) => handleChange('color', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Verde</SelectItem>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="orange">Naranja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Enlace</Label>
                <Input value={form.link as string || ''} onChange={(e) => handleChange('link', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Texto del Enlace</Label>
                <Input value={form.linkText as string || ''} onChange={(e) => handleChange('linkText', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.order as number || 0} onChange={(e) => handleChange('order', parseInt(e.target.value))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.active as boolean || false} onCheckedChange={(v) => handleChange('active', v)} />
                <Label>Activo</Label>
              </div>
            </div>
          </>
        );
      case 'gallery':
        return (
          <>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title as string || ''} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description as string || ''} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen *</Label>
              <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={form.category as string || ''} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partido">Partido</SelectItem>
                    <SelectItem value="torneo">Torneo</SelectItem>
                    <SelectItem value="ceremonia">Ceremonia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.order as number || 0} onChange={(e) => handleChange('order', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active as boolean || false} onCheckedChange={(v) => handleChange('active', v)} />
              <Label>Activo</Label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Render card
  const renderCard = (item: EditableItem, type: string) => {
    const getBasicCard = (title: string, subtitle: string, image: string | null, badges: React.ReactNode) => (
      <Card className="overflow-hidden">
        {image && (
          <div className="h-32 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold line-clamp-1">{title}</h3>
            {badges}
          </div>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{subtitle}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openEditDialog(item, type)}>
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
            <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(item, type)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );

    switch (type) {
      case 'tournament': {
        const t = item as Tournament;
        return getBasicCard(t.name, t.description || '', t.image, <Badge variant={t.status === 'active' ? 'default' : 'secondary'}>{t.status}</Badge>);
      }
      case 'match': {
        const m = item as Match;
        return (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant={m.status === 'finished' ? 'default' : 'secondary'}>{m.status}</Badge>
              </div>
              <div className="flex items-center justify-center gap-4 py-3 bg-gray-50 rounded-lg mb-3">
                <span className="font-semibold">{m.homeTeam}</span>
                <span className="text-xl font-bold text-gray-400">
                  {m.status === 'finished' ? `${m.homeScore} - ${m.awayScore}` : 'VS'}
                </span>
                <span className="font-semibold">{m.awayTeam}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(item, type)}>
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(item, type)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }
      case 'news': {
        const n = item as NewsItem;
        return getBasicCard(n.title, n.summary || '', n.image,
          <div className="flex gap-1">
            {n.published && <Badge className="bg-green-500 text-xs">Publicado</Badge>}
            {n.featured && <Badge className="bg-yellow-500 text-xs">Destacado</Badge>}
          </div>
        );
      }
      case 'event': {
        const e = item as Event;
        return getBasicCard(e.title, `${e.location || ''} - ${e.description || ''}`, e.image, e.eventType ? <Badge variant="outline">{e.eventType}</Badge> : null);
      }
      case 'sponsor': {
        const s = item as Sponsor;
        return (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-3">
                {s.logo ? (
                  <img src={s.logo} alt={s.name} className="h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold">{s.name}</h3>
                  <Badge variant={s.tier === 'gold' ? 'default' : 'secondary'}>{s.tier}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(item, type)}>
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(item, type)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }
      case 'carousel': {
        const c = item as CarouselSlide;
        return getBasicCard(c.title, c.subtitle || '', c.image, <Badge variant={c.active ? 'default' : 'secondary'}>{c.active ? 'Activo' : 'Inactivo'}</Badge>);
      }
      case 'infocard': {
        const ic = item as InfoCard;
        return getBasicCard(ic.title, ic.description || '', ic.image, <Badge variant={ic.active ? 'default' : 'secondary'}>{ic.active ? 'Activo' : 'Inactivo'}</Badge>);
      }
      case 'gallery': {
        const g = item as GalleryItem;
        return getBasicCard(g.title || 'Sin título', g.category || '', g.image, <Badge variant={g.active ? 'default' : 'secondary'}>{g.active ? 'Activo' : 'Inactivo'}</Badge>);
      }
      default:
        return null;
    }
  };

  // Render data list
  const renderDataList = (items: EditableItem[], type: string) => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => openAddDialog(type)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={(item as { id: string }).id}>
              {renderCard(item, type)}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No hay elementos. Haz clic en "Agregar" para crear uno nuevo.</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando panel de desarrollador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver al sitio</span>
            </a>
            <div className="h-6 w-px bg-purple-400" />
            <h1 className="text-xl font-bold">Panel de Desarrollador</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-800/50 px-3 py-1 rounded-full">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.name}</span>
              <Badge className="bg-yellow-500 text-xs">DEV</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-purple-800" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid gap-2 h-auto p-2 bg-white rounded-xl shadow mb-8" style={{ gridTemplateColumns: `repeat(${allTabs.length}, minmax(0, 1fr))` }}>
            {allTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2 py-3">
                <tab.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="torneos">{renderDataList(tournaments as EditableItem[], 'tournament')}</TabsContent>
          <TabsContent value="partidos">{renderDataList(matches as EditableItem[], 'match')}</TabsContent>
          <TabsContent value="noticias">{renderDataList(news as EditableItem[], 'news')}</TabsContent>
          <TabsContent value="eventos">{renderDataList(events as EditableItem[], 'event')}</TabsContent>
          <TabsContent value="patrocinadores">{renderDataList(sponsors as EditableItem[], 'sponsor')}</TabsContent>
          <TabsContent value="carrusel">{renderDataList(carouselSlides as EditableItem[], 'carousel')}</TabsContent>
          <TabsContent value="infocards">{renderDataList(infoCards as EditableItem[], 'infocard')}</TabsContent>
          <TabsContent value="galeria">{renderDataList(galleryItems as EditableItem[], 'gallery')}</TabsContent>
          <TabsContent value="organizacion">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Organización</h3>
                  <p className="text-gray-500">Página de información institucional</p>
                </div>
              </div>
              <a href="/nosotros/organizacion" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button className="bg-green-600 hover:bg-green-700">Ver Página</Button>
              </a>
            </Card>
          </TabsContent>
          <TabsContent value="documentos">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Documentos</h3>
                  <p className="text-gray-500">Documentos oficiales de la liga</p>
                </div>
              </div>
              <a href="/nosotros/documentos" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button className="bg-green-600 hover:bg-green-700">Ver Página</Button>
              </a>
            </Card>
          </TabsContent>
          <TabsContent value="clubes">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Clubes</h3>
                  <p className="text-gray-500">Clubes afiliados a la liga</p>
                </div>
              </div>
              <a href="/nosotros/clubes" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Button className="bg-green-600 hover:bg-green-700">Ver Página</Button>
              </a>
            </Card>
          </TabsContent>
          <TabsContent value="seguridad">{renderSecurityTab()}</TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {renderFormFields(editForm, setEditForm, selectedType)}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleEditSave}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {renderFormFields(addForm, setAddForm, selectedType)}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddSave}>Crear</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p className="py-4">¿Estás seguro de que deseas eliminar este elemento?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
