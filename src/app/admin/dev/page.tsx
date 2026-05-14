"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  FileText,
  FileSpreadsheet,
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
  Link2,
  Server,
  AlertTriangle,
  Wrench,
  Upload,
  FolderOpen,
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
import dynamic from "next/dynamic";

const ExcelViewer = dynamic(() => import("@/components/ExcelViewer"), { ssr: false });

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
  order: number;
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
  order: number;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image: string | null;
  eventType: string | null;
  order: number;
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

interface Team {
  id: string;
  name: string;
  logo: string | null;
  city: string | null;
  category: string | null;
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

interface ScheduleFile {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  fileData: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  active: boolean;
  order: number;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  image: string | null;
  category: string | null;
  status: string;
  order: number;
  active: boolean;
}

type EditableItem = Tournament | Match | NewsItem | Event | Sponsor | CarouselSlide | InfoCard | GalleryItem | Team | SocialMediaItem | Project;

const allTabs = [
  { value: "torneos", label: "Torneos", icon: Trophy },
  { value: "partidos", label: "Partidos", icon: Calendar },
  { value: "noticias", label: "Noticias", icon: FileText },
  { value: "eventos", label: "Eventos", icon: Calendar },
  { value: "patrocinadores", label: "Patrocinadores", icon: Building },
  { value: "carrusel", label: "Carrusel", icon: Layout },
  { value: "infocards", label: "Info Cards", icon: FileText },
  { value: "galeria", label: "Galería", icon: ImageIcon },
  { value: "proyectos", label: "Proyectos", icon: FolderOpen },
  { value: "organizacion", label: "Organización", icon: Shield },
  { value: "documentos", label: "Documentos", icon: FileText },
  { value: "clubes", label: "Clubes", icon: Users },
  { value: "seguridad", label: "Seguridad", icon: Shield },
  { value: "footer", label: "Footer", icon: Link2 },
  { value: "servidores", label: "Servidores", icon: Server },
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
  const [teams, setTeams] = useState<Team[]>([]);
  const [scheduleFiles, setScheduleFiles] = useState<ScheduleFile[]>([]);
  const [socialMediaItems, setSocialMediaItems] = useState<SocialMediaItem[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Damage states
  const [damages, setDamages] = useState<Array<{id: string; page: string; damageType: string; message: string; active: boolean; createdAt: string}>>([]);
  const [damageForm, setDamageForm] = useState({ page: "/", damageType: "collapse", message: "" });
  const [serverInfo, setServerInfo] = useState<{status: string; uptime: string; memory: string; cpu: string} | null>(null);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<ScheduleFile | null>(null);

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
      const [tournamentsRes, matchesRes, newsRes, eventsRes, sponsorsRes, carouselRes, cardsRes, galleryRes, loginAttemptsRes, teamsRes, scheduleFilesRes, socialMediaRes, projectsRes] = await Promise.all([
        fetch('/api/public/tournaments'),
        fetch('/api/public/matches'),
        fetch('/api/admin/news'),
        fetch('/api/public/events'),
        fetch('/api/public/sponsors'),
        fetch('/api/public/carousel'),
        fetch('/api/public/infocards'),
        fetch('/api/public/gallery'),
        fetch('/api/auth/login-attempts'),
        fetch('/api/admin/team'),
        fetch('/api/public/schedule-files'),
        fetch('/api/admin/social-media'),
        fetch('/api/admin/projects'),
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
      setTeams(await teamsRes.json());
      setScheduleFiles(await scheduleFilesRes.json());
      setSocialMediaItems(await socialMediaRes.json());
      setProjects(await projectsRes.json());
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

  // Load damages when switching to servidores tab
  useEffect(() => {
    if (activeTab === "servidores") {
      fetchDamages();
      fetchServerInfo();
    }
  }, [activeTab]);

  const fetchDamages = async () => {
    try {
      const res = await fetch("/api/admin/damages");
      if (res.ok) {
        const data = await res.json();
        setDamages(data);
      }
    } catch (error) {
      console.error("Error fetching damages:", error);
    }
  };

  const fetchServerInfo = async () => {
    try {
      setServerInfo({ status: "Online", uptime: new Date().toLocaleTimeString("es-CO"), memory: "Estable", cpu: "Normal" });
    } catch {
      setServerInfo({ status: "Online", uptime: "N/A", memory: "N/A", cpu: "N/A" });
    }
  };

  const createDamage = async () => {
    if (!damageForm.message.trim()) {
      alert("Escribe un mensaje para el daño");
      return;
    }
    try {
      const res = await fetch("/api/admin/damages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(damageForm),
      });
      if (res.ok) {
        setDamageForm({ page: "/", damageType: "collapse", message: "" });
        fetchDamages();
      } else {
        const err = await res.json();
        alert(err.error || "Error al crear daño");
      }
    } catch (error) {
      console.error("Error creating damage:", error);
      alert("Error al crear daño");
    }
  };

  const fixDamage = async (id: string) => {
    if (!confirm("Arreglar este daño?")) return;
    try {
      const res = await fetch("/api/admin/damages/" + id, { method: "DELETE" });
      if (res.ok) {
        fetchDamages();
      } else {
        alert("Error al arreglar daño");
      }
    } catch (error) {
      console.error("Error fixing damage:", error);
      alert("Error al arreglar daño");
    }
  };

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
      tournament: { status: 'active', category: 'Adulto', order: 0 },
      match: { status: 'scheduled', homeTeam: '', awayTeam: '' },
      news: { published: false, featured: false, order: 0 },
      event: { eventType: 'partido', order: 0 },
      sponsor: { tier: 'bronze', active: true, order: 0 },
      carousel: { order: 0, active: true },
      infocard: { order: 0, active: true, color: 'green', icon: 'trophy' },
      gallery: { order: 0, active: true, image: '' },
      team: { category: 'Adulto' },
      'social-media': { platform: 'facebook', url: '', active: true, order: 0 },
      proyectos: { status: 'active', order: 0, active: true, image: '', category: '' },
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
      const body = { ...addForm };
      const url = `/api/admin/${selectedType}`;

      if (selectedType === 'news' && !body.title) {
        alert('El título es obligatorio');
        return;
      }

      if (selectedType === 'team' && !body.name) {
        alert('El nombre es obligatorio');
        return;
      }

      if (selectedType === 'proyectos' && !body.title) {
        alert('El título es obligatorio');
        return;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  // Render servidores tab
  const renderServidoresTab = () => (
    <div className="space-y-6">
      {/* Server Info */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-600" />
          Estado del Servidor
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Estado</p>
            <p className="text-lg font-bold text-green-600">{serverInfo?.status || "Online"}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Hora</p>
            <p className="text-lg font-bold text-blue-600">{serverInfo?.uptime || "N/A"}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Memoria</p>
            <p className="text-lg font-bold text-purple-600">{serverInfo?.memory || "N/A"}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">CPU</p>
            <p className="text-lg font-bold text-amber-600">{serverInfo?.cpu || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Create Damage */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Producir Daño
        </h2>
        <p className="text-gray-500 mb-4">
          Crea un daño en una página del sitio. COLAPSO hace la página completamente inservible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Página</Label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
              value={damageForm.page}
              onChange={(e) => setDamageForm({ ...damageForm, page: e.target.value })}
            >
              <option value="*">* TODAS las páginas</option>
              <option value="/">/ Inicio</option>
              <option value="/torneos">/ Torneos</option>
              <option value="/programacion">/ Programación</option>
              <option value="/noticias">/ Noticias</option>
              <option value="/eventos">/ Eventos</option>
              <option value="/nosotros">/ Nosotros</option>
              <option value="/nosotros/clubes">/ Clubes</option>
              <option value="/nosotros/documentos">/ Documentos</option>
              <option value="/nosotros/organizacion">/ Organización</option>
            </select>
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">Tipo de Daño</Label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white text-sm"
              value={damageForm.damageType}
              onChange={(e) => setDamageForm({ ...damageForm, damageType: e.target.value })}
            >
              <option value="collapse">COLAPSO - Página inservible</option>
              <option value="warning">ADVERTENCIA - Banner grande</option>
              <option value="custom">PERSONALIZADO - Aviso inferior</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={createDamage}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Producir Daño
            </Button>
          </div>
        </div>
        <div>
          <Label className="block text-sm font-medium mb-1">Mensaje del Daño</Label>
          <Textarea
            className="w-full min-h-[100px] text-base"
            placeholder="Escribe el mensaje que verán los usuarios... (se muestra completo y grande)"
            value={damageForm.message}
            onChange={(e) => setDamageForm({ ...damageForm, message: e.target.value })}
          />
        </div>
      </div>

      {/* Active Damages */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-orange-600" />
          Daños Activos ({damages.filter(d => d.active).length})
        </h2>
        {damages.length > 0 ? (
          <div className="space-y-3">
            {damages.map((damage) => (
              <div
                key={damage.id}
                className={"border rounded-lg p-4 " + (damage.active
                  ? damage.damageType === "collapse"
                    ? "bg-red-50 border-red-300"
                    : damage.damageType === "warning"
                      ? "bg-amber-50 border-amber-300"
                      : "bg-blue-50 border-blue-300"
                  : "bg-gray-50 border-gray-200 opacity-60"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={
                        damage.damageType === "collapse"
                          ? "bg-red-500 text-white"
                          : damage.damageType === "warning"
                            ? "bg-amber-500 text-white"
                            : "bg-blue-500 text-white"
                      }>
                        {damage.damageType === "collapse" ? "COLAPSO" : damage.damageType === "warning" ? "ADVERTENCIA" : "PERSONALIZADO"}
                      </Badge>
                      <Badge className="bg-gray-500 text-white">{damage.page}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{damage.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(damage.createdAt).toLocaleString("es-CO")}
                    </p>
                  </div>
                  {damage.active && (
                    <Button
                      size="sm"
                      onClick={() => fixDamage(damage.id)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Arreglar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay daños registrados</p>
        )}
      </div>
    </div>
  );

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

  // Cronogramas functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      alert('Solo se permiten archivos Excel (.xlsx, .xls)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAddForm({
        name: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileType: ext,
        fileData: base64,
        description: '',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async () => {
    if (!addForm.fileData) { alert('Selecciona un archivo'); return; }
    try {
      const res = await fetch('/api/admin/schedule-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        setUploadDialogOpen(false);
        setAddForm({});
        fetchAllData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al subir');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error al subir archivo');
    }
  };

  const handleDeleteScheduleFile = async (id: string) => {
    if (!confirm('¿Eliminar este archivo?')) return;
    try {
      const res = await fetch(`/api/admin/schedule-file/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
      else alert('Error al eliminar');
    } catch { alert('Error al eliminar'); }
  };

  // Render form fields
  const renderFormFields = (form: Record<string, unknown>, setForm: React.Dispatch<React.SetStateAction<Record<string, unknown>>>, type: string) => {
    const handleChange = (field: string, value: unknown) => {
      setForm(prev => ({ ...prev, [field]: value }));
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
            <div className="space-y-2">
              <Label>Orden de Visualización</Label>
              <Input type="number" value={form.order as number ?? 0} onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)} />
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
              <Label>Título *</Label>
              <Input value={form.title as string || ''} onChange={(e) => handleChange('title', e.target.value)} placeholder="Título de la noticia" />
            </div>
            <div className="space-y-2">
              <Label>Resumen</Label>
              <Textarea value={form.summary as string || ''} onChange={(e) => handleChange('summary', e.target.value)} placeholder="Breve resumen" />
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <Textarea className="min-h-32" value={form.content as string || ''} onChange={(e) => handleChange('content', e.target.value)} placeholder="Contenido completo" />
            </div>
            <div className="space-y-2">
              <Label>Autor</Label>
              <Input value={form.author as string || ''} onChange={(e) => handleChange('author', e.target.value)} placeholder="Nombre del autor" />
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={(form.published as boolean) ? 'published' : 'draft'} onValueChange={(v) => handleChange('published', v === 'published')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destacado</Label>
                <Select value={(form.featured as boolean) ? 'yes' : 'no'} onValueChange={(v) => handleChange('featured', v === 'yes')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Orden de Visualización</Label>
              <Input type="number" value={form.order as number ?? 0} onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)} />
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
            <div className="space-y-2">
              <Label>Orden de Visualización</Label>
              <Input type="number" value={form.order as number ?? 0} onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)} />
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
            <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
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
              <div className="flex items-center gap-2 pt-6" onPointerDown={(e) => e.stopPropagation()}>
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
              <div className="flex items-center gap-2 pt-6" onPointerDown={(e) => e.stopPropagation()}>
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
              <div className="flex gap-2">
                <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." className="flex-1" />
                <input type="file" accept="image/*" className="w-10" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fd = new FormData();
                    fd.append('file', file);
                    fetch('/api/admin/upload', { method: 'POST', body: fd }).then(r => r.json()).then(data => {
                      if (data.url) handleChange('image', data.url);
                    });
                  }
                }} />
              </div>
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
            <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
              <Switch checked={form.active as boolean || false} onCheckedChange={(v) => handleChange('active', v)} />
              <Label>Activo</Label>
            </div>
          </>
        );
      case 'team':
        return (
          <>
            <div className="space-y-2">
              <Label>Nombre del Club</Label>
              <Input value={form.name as string || ''} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL del Logo</Label>
              <Input value={form.logo as string || ''} onChange={(e) => handleChange('logo', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input value={form.city as string || ''} onChange={(e) => handleChange('city', e.target.value)} placeholder="Ej: Manizales" />
            </div>
            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <Input type="email" value={form.email as string || ''} onChange={(e) => handleChange('email', e.target.value)} placeholder="Ej: club@ejemplo.com" />
            </div>
          </>
        );
      case 'social-media':
        return (
          <>
            <div className="space-y-2">
              <Label>Plataforma *</Label>
              <Select value={form.platform as string || 'facebook'} onValueChange={(v) => handleChange('platform', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL del Enlace *</Label>
              <Input value={form.url as string || ''} onChange={(e) => handleChange('url', e.target.value)} placeholder="https://facebook.com/mi-pagina" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.order as number || 0} onChange={(e) => handleChange('order', parseInt(e.target.value))} />
              </div>
              <div className="flex items-center gap-2 pt-6" onPointerDown={(e) => e.stopPropagation()}>
                <Switch checked={form.active as boolean || false} onCheckedChange={(v) => handleChange('active', v)} />
                <Label>Activo</Label>
              </div>
            </div>
          </>
        );
      case 'proyectos':
        return (
          <>
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={form.title as string || ''} onChange={(e) => handleChange('title', e.target.value)} placeholder="Título del proyecto" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug as string || ''} readOnly className="bg-gray-100 text-gray-500" />
              <p className="text-xs text-gray-400">Se genera automáticamente a partir del título</p>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description as string || ''} onChange={(e) => handleChange('description', e.target.value)} placeholder="Breve descripción" />
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <Textarea className="min-h-40" value={form.content as string || ''} onChange={(e) => handleChange('content', e.target.value)} placeholder="Contenido HTML del proyecto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Input value={form.category as string || ''} onChange={(e) => handleChange('category', e.target.value)} placeholder="Ej: Infraestructura" />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.status as string || 'active'} onValueChange={(v) => handleChange('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="upcoming">Próximo</SelectItem>
                    <SelectItem value="finished">Finalizado</SelectItem>
                    <SelectItem value="archived">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL de Imagen</Label>
              <div className="flex gap-2">
                <Input value={form.image as string || ''} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." className="flex-1" />
                <input type="file" accept="image/*" className="w-10" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fd = new FormData();
                    fd.append('file', file);
                    fetch('/api/admin/upload', { method: 'POST', body: fd }).then(r => r.json()).then(data => {
                      if (data.url) handleChange('image', data.url);
                    });
                  }
                }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Orden</Label>
              <Input type="number" value={form.order as number || 0} onChange={(e) => handleChange('order', parseInt(e.target.value))} />
            </div>
            <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
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
        return getBasicCard(t.name, t.description || '', t.image,
          <div className="flex gap-1">
            <Badge variant={t.status === 'active' ? 'default' : 'secondary'}>{t.status}</Badge>
            <Badge variant="outline" className="text-xs">Orden: {t.order}</Badge>
          </div>
        );
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
          <div className="flex gap-1 flex-wrap">
            {n.published && <Badge className="bg-green-500 text-xs">Publicado</Badge>}
            {n.featured && <Badge className="bg-yellow-500 text-xs">Destacado</Badge>}
            <Badge variant="outline" className="text-xs">Orden: {n.order}</Badge>
          </div>
        );
      }
      case 'event': {
        const e = item as Event;
        return getBasicCard(e.title, `${e.location || ''} - ${e.description || ''}`, e.image,
          <div className="flex gap-1 flex-wrap">
            {e.eventType ? <Badge variant="outline">{e.eventType}</Badge> : null}
            <Badge variant="outline" className="text-xs">Orden: {e.order}</Badge>
          </div>
        );
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
      case 'proyectos': {
        const p = item as Project;
        return (
          <Card className="overflow-hidden">
            {p.image && (
              <div className="h-32 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold line-clamp-1">{p.title}</h3>
                <div className="flex gap-1 ml-2">
                  {p.category && <Badge variant="outline" className="text-xs">{p.category}</Badge>}
                  <Badge className={
                    p.status === 'active' ? 'bg-green-500 text-xs' :
                    p.status === 'upcoming' ? 'bg-blue-500 text-xs' :
                    p.status === 'finished' ? 'bg-gray-500 text-xs' :
                    'bg-amber-500 text-xs'
                  }>{p.status}</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description || p.slug}</p>
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
      case 'team': {
        const t = item as Team;
        return (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-3">
                {t.logo ? (
                  <img src={t.logo} alt={t.name} className="h-14 w-14 object-contain rounded-lg" />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Users className="h-7 w-7 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.city || 'Sin ciudad'}</p>
                  {t.category && <Badge variant="outline" className="mt-1">{t.category}</Badge>}
                </div>
              </div>
              {t.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 pl-1">
                  <svg className="h-3.5 w-3.5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span className="truncate">{t.email}</span>
                </div>
              )}
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
      case 'social-media': {
        const sm = item as SocialMediaItem;
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${sm.active ? 'bg-green-100' : 'bg-gray-200'}`}>
                  {platformIcons[sm.platform] ? (
                    <svg className={`h-6 w-6 ${sm.active ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d={platformIcons[sm.platform]} />
                    </svg>
                  ) : (
                    <Link2 className={`h-6 w-6 ${sm.active ? 'text-green-600' : 'text-gray-400'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold capitalize">{sm.platform}</h3>
                  <p className="text-sm text-gray-500 truncate">{sm.url}</p>
                  <Badge variant={sm.active ? 'default' : 'secondary'} className="mt-1">{sm.active ? 'Activo' : 'Inactivo'}</Badge>
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
          <TabsList className="flex flex-wrap gap-2 h-auto p-2 bg-white rounded-xl shadow mb-8">
            {allTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <tab.icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="torneos">{renderDataList(tournaments as EditableItem[], 'tournament')}</TabsContent>
          <TabsContent value="partidos">
            <div className="space-y-6">
              {/* Matches list */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Partidos
                    </h3>
                    <p className="text-gray-500 mt-1">Gestión de partidos del torneo</p>
                  </div>
                  <Button onClick={() => openAddDialog('match')}>
                    <Plus className="h-4 w-4 mr-2" /> Nuevo Partido
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches.map(m => renderCard(m as EditableItem, 'match'))}
                </div>
              </div>

              {/* Schedule files (Excel/PDF) */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      Programación de Partidos
                    </h3>
                    <p className="text-gray-500 mt-1">Sube archivos Excel con la programación de partidos</p>
                  </div>
                  <Button onClick={() => { setAddForm({}); setUploadDialogOpen(true); }} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" /> Subir Excel
                  </Button>
                </div>

                {scheduleFiles.length > 0 ? (
                  <div className="space-y-3">
                    {scheduleFiles.map((file) => (
                      <Card key={file.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${file.fileType === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{file.name}</h4>
                                <p className="text-xs text-gray-400">{file.fileName} - {file.fileType.toUpperCase()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setPreviewFile(file); setPreviewDialogOpen(true); }}>
                                Ver
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteScheduleFile(file.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <FileSpreadsheet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay archivos de programación</p>
                  </div>
                )}
              </div>

              {/* Upload Dialog */}
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Subir Archivo Excel</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Archivo Excel *</Label>
                      <Input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input value={addForm.name as string || ''} onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Nombre del archivo" />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción (opcional)</Label>
                      <Textarea value={addForm.description as string || ''} onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Descripción breve" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={handleFileUpload} disabled={!addForm.fileData}>Subir</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Preview Dialog */}
              <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>{previewFile?.name}</DialogTitle>
                  </DialogHeader>
                  <div className="overflow-auto" style={{ maxHeight: '75vh' }}>
                    {previewFile && previewFile.fileData ? (
                      <ExcelViewer fileData={previewFile.fileData} fileName={previewFile.fileName || previewFile.name} />
                    ) : null}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
          <TabsContent value="noticias">{renderDataList(news as EditableItem[], 'news')}</TabsContent>
          <TabsContent value="eventos">{renderDataList(events as EditableItem[], 'event')}</TabsContent>
          <TabsContent value="patrocinadores">{renderDataList(sponsors as EditableItem[], 'sponsor')}</TabsContent>
          <TabsContent value="carrusel">{renderDataList(carouselSlides as EditableItem[], 'carousel')}</TabsContent>
          <TabsContent value="infocards">{renderDataList(infoCards as EditableItem[], 'infocard')}</TabsContent>
          <TabsContent value="galeria">{renderDataList(galleryItems as EditableItem[], 'gallery')}</TabsContent>
          <TabsContent value="proyectos">{renderDataList(projects as unknown as EditableItem[], 'proyectos')}</TabsContent>
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
          <TabsContent value="clubes">{renderDataList(teams as unknown as EditableItem[], 'team')}</TabsContent>
          <TabsContent value="footer">{renderDataList(socialMediaItems as unknown as EditableItem[], 'social-media')}</TabsContent>
          <TabsContent value="servidores">{renderServidoresTab()}</TabsContent>
          <TabsContent value="seguridad">{renderSecurityTab()}</TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4" onPointerDown={(e) => e.stopPropagation()}>
            {renderFormFields(editForm, setEditForm, selectedType)}
          </div>
          <div className="flex justify-end gap-2" onPointerDown={(e) => e.stopPropagation()}>
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); setEditDialogOpen(false); }}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={(e) => { e.stopPropagation(); handleEditSave(); }}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4" onPointerDown={(e) => e.stopPropagation()}>
            {renderFormFields(addForm, setAddForm, selectedType)}
          </div>
          <div className="flex justify-end gap-2" onPointerDown={(e) => e.stopPropagation()}>
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); setAddDialogOpen(false); }}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={(e) => { e.stopPropagation(); handleAddSave(); }}>Crear</Button>
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
