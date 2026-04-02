"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Upload,
  File,
  Eye,
  X,
  Clock,
  MapPin,
  BarChart3,
  Target,
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
  DialogFooter,
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

interface ScheduleFile {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  fileData?: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

interface StatisticsFile {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  fileData?: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

interface Standing {
  id: string;
  teamName: string;
  teamLogo: string | null;
  category: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  order: number;
  active: boolean;
}

interface TopScorer {
  id: string;
  name: string;
  team: string;
  goals: number;
  assists: number;
  category: string;
  order: number;
  active: boolean;
}

interface Resolution {
  id: string;
  title: string;
  type: string;
  number: string;
  description: string | null;
  fileUrl: string | null;
  fileData: string | null;
  fileName: string | null;
  fileType: string | null;
  date: string;
  active: boolean;
}

interface UserInfo {
  name: string;
  role: string;
}

type EditableItem = Tournament | Match | NewsItem | Event | Sponsor | CarouselSlide | InfoCard | GalleryItem | Standing | TopScorer | Resolution;

// Admin tabs configuration based on role
const getAvailableTabs = (role: string) => {
  const allTabs = [
    { value: "torneos", label: "Torneos", icon: Trophy },
    { value: "partidos", label: "Partidos", icon: Calendar },
    { value: "estadisticas", label: "Estadísticas", icon: BarChart3 },
    { value: "resoluciones", label: "Resoluciones", icon: FileText },
    { value: "documentos", label: "Documentos", icon: File },
    { value: "noticias", label: "Noticias", icon: FileText },
    { value: "eventos", label: "Eventos", icon: Calendar },
    { value: "patrocinadores", label: "Patrocinadores", icon: Building },
    { value: "carrusel", label: "Carrusel", icon: Layout },
    { value: "galeria", label: "Galería", icon: ImageIcon },
  ];

  if (role === 'dev') {
    return allTabs; // Full access
  }

  // Admin can access: torneos, partidos, estadisticas, resoluciones, documentos, noticias, eventos
  return allTabs.filter(tab => 
    ['torneos', 'partidos', 'estadisticas', 'resoluciones', 'documentos', 'noticias', 'eventos'].includes(tab.value)
  );
};

export default function AdminPage() {
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
  const [scheduleFiles, setScheduleFiles] = useState<ScheduleFile[]>([]);
  const [statisticsFiles, setStatisticsFiles] = useState<StatisticsFile[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EditableItem | null>(null);
  const [editForm, setEditForm] = useState<Record<string, unknown>>({});
  const [addForm, setAddForm] = useState<Record<string, unknown>>({});
  const [selectedType, setSelectedType] = useState<string>("");

  // File upload states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<ScheduleFile | null>(null);
  const [uploadForm, setUploadForm] = useState({ name: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Statistics file upload states
  const [statsUploadDialogOpen, setStatsUploadDialogOpen] = useState(false);
  const [statsPreviewDialogOpen, setStatsPreviewDialogOpen] = useState(false);
  const [statsPreviewFile, setStatsPreviewFile] = useState<StatisticsFile | null>(null);
  const [statsUploadForm, setStatsUploadForm] = useState({ name: '', description: '' });
  const [statsUploading, setStatsUploading] = useState(false);
  const statsFileInputRef = useRef<HTMLInputElement>(null);
  const [statsSelectedFile, setStatsSelectedFile] = useState<File | null>(null);

  // Resolution file upload states
  const [resUploadDialogOpen, setResUploadDialogOpen] = useState(false);
  const [resUploading, setResUploading] = useState(false);
  const resFileInputRef = useRef<HTMLInputElement>(null);
  const [resSelectedFile, setResSelectedFile] = useState<File | null>(null);
  const [resUploadForm, setResUploadForm] = useState({ title: '', type: 'resolucion', number: '', description: '' });
  const [resFileInputKey, setResFileInputKey] = useState(0);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [statsFileInputKey, setStatsFileInputKey] = useState(0);

  // Fetch data function
  const fetchAllData = useCallback(async () => {
    try {
      const [tournamentsRes, matchesRes, newsRes, eventsRes, sponsorsRes, carouselRes, cardsRes, galleryRes, scheduleFilesRes, statisticsFilesRes, standingsRes, topScorersRes, resolutionsRes] = await Promise.all([
        fetch('/api/public/tournaments'),
        fetch('/api/public/matches'),
        fetch('/api/public/news'),
        fetch('/api/public/events'),
        fetch('/api/public/sponsors'),
        fetch('/api/public/carousel'),
        fetch('/api/public/infocards'),
        fetch('/api/public/gallery'),
        fetch('/api/public/schedule-files'),
        fetch('/api/public/statistics-files'),
        fetch('/api/public/standings'),
        fetch('/api/public/top-scorers'),
        fetch('/api/public/resolutions'),
      ]);

      setTournaments(await tournamentsRes.json());
      setMatches(await matchesRes.json());
      setNews(await newsRes.json());
      setEvents(await eventsRes.json());
      setSponsors(await sponsorsRes.json());
      setCarouselSlides(await carouselRes.json());
      setInfoCards(await cardsRes.json());
      setGalleryItems(await galleryRes.json());
      setScheduleFiles(await scheduleFilesRes.json());
      setStatisticsFiles(await statisticsFilesRes.json());
      setStandings(await standingsRes.json());
      setTopScorers(await topScorersRes.json());
      setResolutions(await resolutionsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      const loggedIn = sessionStorage.getItem('lcf_admin_logged_in');
      const userData = sessionStorage.getItem('lcf_admin_user');
      
      if (loggedIn !== 'true' || !userData) {
        window.location.href = '/';
        return;
      }

      try {
        const userInfo = JSON.parse(userData);
        setUser(userInfo);
      } catch {
        window.location.href = '/';
        return;
      }

      await fetchAllData();
      setLoading(false);
    };
    init();
  }, [fetchAllData]);

  // Open edit dialog
  const openEditDialog = useCallback((item: EditableItem, type: string) => {
    setSelectedItem(item);
    setSelectedType(type);
    setEditForm({ ...item });
    setEditDialogOpen(true);
  }, []);

  // Open add dialog
  const openAddDialog = useCallback((type: string) => {
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
      standing: { category: 'primera-a', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, order: 0, active: true },
      topScorer: { category: 'primera-a', goals: 0, assists: 0, order: 0, active: true },
      resolution: { type: 'resolucion', number: '', active: true },
    };

    setAddForm(defaults[type] || {});
    setAddDialogOpen(true);
  }, []);

  // Open delete dialog
  const openDeleteDialog = useCallback((item: EditableItem, type: string) => {
    setSelectedItem(item);
    setSelectedType(type);
    setDeleteDialogOpen(true);
  }, []);

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
    window.location.href = '/';
  };

  // Handle file selection (now for PDF)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      setSelectedFile(file);
      setUploadForm({ ...uploadForm, name: file.name.replace(/\.[^/.]+$/, '') });
    }
  };

  // Handle file upload (now for PDF)
  const handleFileUpload = async () => {
    if (!selectedFile || !uploadForm.name) {
      alert('Por favor selecciona un archivo PDF y proporciona un nombre');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        const res = await fetch('/api/admin/schedule-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: uploadForm.name,
            fileName: selectedFile.name,
            fileType: 'pdf',
            fileData: base64,
            description: uploadForm.description,
          }),
        });

        if (res.ok) {
          setUploadDialogOpen(false);
          setSelectedFile(null);
          setUploadForm({ name: '', description: '' });
          setFileInputKey(prev => prev + 1);
          fetchAllData();
        } else {
          const data = await res.json();
          alert(data.error || 'Error al subir archivo');
        }
        setUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir archivo');
      setUploading(false);
    }
  };

  // Handle file preview
  const handlePreview = async (file: ScheduleFile) => {
    try {
      const res = await fetch(`/api/admin/schedule-file/${file.id}`);
      const data = await res.json();
      setPreviewFile(data);
      setPreviewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching file for preview:', error);
      alert('Error al cargar archivo para vista previa');
    }
  };

  // Handle file delete
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  
  const handleFileDelete = async (id: string) => {
    if (deletingFileId === id) return; // Evitar doble clic
    
    if (!confirm('¿Estás seguro de que deseas eliminar este archivo?')) return;

    setDeletingFileId(id);
    try {
      const res = await fetch(`/api/admin/schedule-file/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Actualizar lista localmente sin esperar fetchAllData
        setScheduleFiles(prev => prev.filter(f => f.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar archivo');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error al eliminar archivo');
    } finally {
      setDeletingFileId(null);
    }
  };

  // Handle statistics file selection
  const handleStatsFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      setStatsSelectedFile(file);
      setStatsUploadForm({ ...statsUploadForm, name: file.name.replace(/\.[^/.]+$/, '') });
    }
  };

  // Handle statistics file upload
  const handleStatsFileUpload = async () => {
    if (!statsSelectedFile || !statsUploadForm.name) {
      alert('Por favor selecciona un archivo PDF y proporciona un nombre');
      return;
    }

    setStatsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        const res = await fetch('/api/admin/statistics-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: statsUploadForm.name,
            fileName: statsSelectedFile.name,
            fileType: 'pdf',
            fileData: base64,
            description: statsUploadForm.description,
          }),
        });

        if (res.ok) {
          setStatsUploadDialogOpen(false);
          setStatsSelectedFile(null);
          setStatsUploadForm({ name: '', description: '' });
          setStatsFileInputKey(prev => prev + 1);
          fetchAllData();
        } else {
          const data = await res.json();
          alert(data.error || 'Error al subir archivo');
        }
        setStatsUploading(false);
      };
      reader.readAsDataURL(statsSelectedFile);
    } catch (error) {
      console.error('Error uploading statistics file:', error);
      alert('Error al subir archivo');
      setStatsUploading(false);
    }
  };

  // Handle statistics file preview
  const handleStatsPreview = async (file: StatisticsFile) => {
    try {
      const res = await fetch(`/api/admin/statistics-file/${file.id}`);
      const data = await res.json();
      setStatsPreviewFile(data);
      setStatsPreviewDialogOpen(true);
    } catch (error) {
      console.error('Error fetching statistics file for preview:', error);
      alert('Error al cargar archivo para vista previa');
    }
  };

  // Handle statistics file delete
  const [deletingStatsFileId, setDeletingStatsFileId] = useState<string | null>(null);
  
  const handleStatsFileDelete = async (id: string) => {
    if (deletingStatsFileId === id) return; // Evitar doble clic
    
    if (!confirm('¿Estás seguro de que deseas eliminar este archivo?')) return;

    setDeletingStatsFileId(id);
    try {
      const res = await fetch(`/api/admin/statistics-file/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Actualizar lista localmente sin esperar fetchAllData
        setStatisticsFiles(prev => prev.filter(f => f.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar archivo');
      }
    } catch (error) {
      console.error('Error deleting statistics file:', error);
      alert('Error al eliminar archivo');
    } finally {
      setDeletingStatsFileId(null);
    }
  };

  // Handle resolution file selection
  const handleResFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      setResSelectedFile(file);
      setResUploadForm({ ...resUploadForm, title: file.name.replace(/\.[^/.]+$/, '') });
    }
  };

  // Handle resolution file upload
  const handleResFileUpload = async () => {
    if (!resSelectedFile || !resUploadForm.title) {
      alert('Por favor selecciona un archivo y proporciona un título');
      return;
    }

    setResUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        const res = await fetch('/api/admin/resolution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: resUploadForm.title,
            type: resUploadForm.type,
            number: resUploadForm.number,
            description: resUploadForm.description,
            fileName: resSelectedFile.name,
            fileType: 'pdf',
            fileData: base64,
            date: new Date().toISOString(),
            active: true,
          }),
        });

        if (res.ok) {
          setResUploadDialogOpen(false);
          setResSelectedFile(null);
          setResUploadForm({ title: '', type: 'resolucion', number: '', description: '' });
          setResFileInputKey(prev => prev + 1);
          fetchAllData();
          alert('Resolución subida correctamente');
        } else {
          const data = await res.json();
          alert(data.error || 'Error al subir resolución');
        }
        setResUploading(false);
      };
      reader.readAsDataURL(resSelectedFile);
    } catch (error) {
      console.error('Error uploading resolution file:', error);
      alert('Error al subir archivo');
      setResUploading(false);
    }
  };

  // Handle resolution delete
  const handleResDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta resolución?')) return;

    try {
      const res = await fetch(`/api/admin/resolution/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchAllData();
        alert('Resolución eliminada correctamente');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar resolución');
      }
    } catch (error) {
      console.error('Error deleting resolution:', error);
      alert('Error al eliminar resolución');
    }
  };



  // Render form fields based on type
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
                <Input value={form.link as string || ''} onChange={(e) => handleChange('link', e.target.value)} placeholder="#section" />
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
      case 'standing':
        return (
          <>
            <div className="space-y-2">
              <Label>Nombre del Equipo</Label>
              <Input value={form.teamName as string || ''} onChange={(e) => handleChange('teamName', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logo (URL)</Label>
                <Input value={form.teamLogo as string || ''} onChange={(e) => handleChange('teamLogo', e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={form.category as string || 'primera-a'} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primera-a">Primera A</SelectItem>
                    <SelectItem value="primera-b">Primera B</SelectItem>
                    <SelectItem value="sub-20">Sub-20</SelectItem>
                    <SelectItem value="sub-17">Sub-17</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label>PJ</Label>
                <Input type="number" value={form.played as number || 0} onChange={(e) => handleChange('played', parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>G</Label>
                <Input type="number" value={form.won as number || 0} onChange={(e) => handleChange('won', parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>E</Label>
                <Input type="number" value={form.drawn as number || 0} onChange={(e) => handleChange('drawn', parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>P</Label>
                <Input type="number" value={form.lost as number || 0} onChange={(e) => handleChange('lost', parseInt(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>GF</Label>
                <Input type="number" value={form.goalsFor as number || 0} onChange={(e) => handleChange('goalsFor', parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>GC</Label>
                <Input type="number" value={form.goalsAgainst as number || 0} onChange={(e) => handleChange('goalsAgainst', parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Puntos</Label>
                <Input type="number" value={form.points as number || 0} onChange={(e) => handleChange('points', parseInt(e.target.value))} />
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
      case 'topScorer':
        return (
          <>
            <div className="space-y-2">
              <Label>Nombre del Jugador</Label>
              <Input value={form.name as string || ''} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Equipo</Label>
                <Input value={form.team as string || ''} onChange={(e) => handleChange('team', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={form.category as string || 'primera-a'} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primera-a">Primera A</SelectItem>
                    <SelectItem value="primera-b">Primera B</SelectItem>
                    <SelectItem value="sub-20">Sub-20</SelectItem>
                    <SelectItem value="sub-17">Sub-17</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Goles</Label>
                <Input type="number" value={form.goals as number || 0} onChange={(e) => handleChange('goals', parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Asistencias</Label>
                <Input type="number" value={form.assists as number || 0} onChange={(e) => handleChange('assists', parseInt(e.target.value))} />
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
      case 'resolution':
        return (
          <>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title as string || ''} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.type as string || 'resolucion'} onValueChange={(v) => handleChange('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reglamento">Reglamento</SelectItem>
                    <SelectItem value="resolucion">Resolución</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                    <SelectItem value="acta">Acta</SelectItem>
                    <SelectItem value="calendario">Calendario</SelectItem>
                    <SelectItem value="sancion">Sanción</SelectItem>
                    <SelectItem value="protocolo">Protocolo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input value={form.number as string || ''} onChange={(e) => handleChange('number', e.target.value)} placeholder="RG-001-2025" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description as string || ''} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input type="date" value={form.date as string || ''} onChange={(e) => handleChange('date', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>URL del Archivo</Label>
                <Input value={form.fileUrl as string || ''} onChange={(e) => handleChange('fileUrl', e.target.value)} placeholder="https://..." />
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

  // Render card based on type
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
        return getBasicCard(
          t.name,
          t.description || '',
          t.image,
          <Badge variant={t.status === 'active' ? 'default' : 'secondary'}>{t.status}</Badge>
        );
      }
      case 'match': {
        const m = item as Match;
        return (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant={m.status === 'finished' ? 'default' : 'secondary'}>{m.status}</Badge>
                {m.tournament && <span className="text-xs text-gray-500">{m.tournament.name}</span>}
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
        return getBasicCard(
          n.title,
          n.summary || '',
          n.image,
          <div className="flex gap-1">
            {n.published && <Badge className="bg-green-500 text-xs">Publicado</Badge>}
            {n.featured && <Badge className="bg-yellow-500 text-xs">Destacado</Badge>}
          </div>
        );
      }
      case 'event': {
        const e = item as Event;
        return getBasicCard(
          e.title,
          `${e.location || ''} - ${e.description || ''}`,
          e.image,
          e.eventType ? <Badge variant="outline">{e.eventType}</Badge> : null
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
        return getBasicCard(
          c.title,
          c.subtitle || '',
          c.image,
          <Badge variant={c.active ? 'default' : 'secondary'}>{c.active ? 'Activo' : 'Inactivo'}</Badge>
        );
      }
      case 'infocard': {
        const ic = item as InfoCard;
        return getBasicCard(
          ic.title,
          ic.description || '',
          ic.image,
          <Badge variant={ic.active ? 'default' : 'secondary'}>{ic.active ? 'Activo' : 'Inactivo'}</Badge>
        );
      }
      case 'gallery': {
        const g = item as GalleryItem;
        return getBasicCard(
          g.title || 'Sin título',
          g.category || '',
          g.image,
          <Badge variant={g.active ? 'default' : 'secondary'}>{g.active ? 'Activo' : 'Inactivo'}</Badge>
        );
      }
      case 'standing': {
        const s = item as Standing;
        return (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{s.teamName}</h3>
                <Badge variant="outline">{s.category}</Badge>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-sm mb-3">
                <div><span className="text-gray-500">PJ</span><br /><span className="font-semibold">{s.played}</span></div>
                <div><span className="text-gray-500">G</span><br /><span className="font-semibold text-green-600">{s.won}</span></div>
                <div><span className="text-gray-500">E</span><br /><span className="font-semibold text-amber-600">{s.drawn}</span></div>
                <div><span className="text-gray-500">P</span><br /><span className="font-semibold text-red-600">{s.lost}</span></div>
                <div><span className="text-gray-500">PTS</span><br /><span className="font-bold text-lg">{s.points}</span></div>
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
      case 'topScorer': {
        const t = item as TopScorer;
        return (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{t.name}</h3>
                <Badge variant="outline">{t.category}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">{t.team}</p>
              <div className="flex gap-4 mb-3">
                <div className="text-center">
                  <Target className="h-5 w-5 mx-auto text-green-600" />
                  <p className="font-bold text-xl">{t.goals}</p>
                  <p className="text-xs text-gray-500">Goles</p>
                </div>
                <div className="text-center">
                  <Trophy className="h-5 w-5 mx-auto text-blue-600" />
                  <p className="font-bold text-xl">{t.assists}</p>
                  <p className="text-xs text-gray-500">Asistencias</p>
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
      case 'resolution': {
        const r = item as Resolution;
        return (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={r.type === 'reglamento' ? 'bg-purple-100 text-purple-800' : r.type === 'resolucion' ? 'bg-blue-100 text-blue-800' : r.type === 'circular' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {r.type}
                </Badge>
                <span className="text-xs text-gray-500 font-mono">{r.number}</span>
              </div>
              <h3 className="font-bold mb-2 line-clamp-1">{r.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{r.description}</p>
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
          <p>Cargando panel...</p>
        </div>
      </div>
    );
  }

  const availableTabs = getAvailableTabs(user?.role || '');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Volver al sitio</span>
            </a>
            <div className="h-6 w-px bg-green-400" />
            <h1 className="text-xl font-bold">Panel de Administración</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-800/50 px-3 py-1 rounded-full">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.name}</span>
              <Badge variant="secondary" className="text-xs">
                {user?.role === 'dev' ? 'Desarrollador' : 'Administrador'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid gap-2 h-auto p-2 bg-white rounded-xl shadow mb-8" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, minmax(0, 1fr))` }}>
            {availableTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2 py-3">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="torneos">{renderDataList(tournaments.filter(t => t.image) as EditableItem[], 'tournament')}</TabsContent>
          <TabsContent value="partidos">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Programación de Partidos
                  </h3>
                  <p className="text-sm text-gray-500">Sube archivos PDF con la programación de partidos</p>
                </div>
                <Button onClick={() => setUploadDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir PDF
                </Button>
              </div>

              {scheduleFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduleFiles.map((file) => (
                    <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                            <File className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{file.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{file.fileName}</p>
                            {file.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{file.description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(file.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => handlePreview(file)} className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleFileDelete(file.id)}
                            disabled={deletingFileId === file.id}
                            className={deletingFileId === file.id ? "opacity-50 cursor-not-allowed" : ""}
                          >
                            {deletingFileId === file.id ? (
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <File className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay archivos de programación</p>
                  <p className="text-sm text-gray-400 mt-1">Sube un archivo PDF para comenzar</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="noticias">
            {/* Botón para agregar noticia */}
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => openAddDialog('news')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar Noticia
              </Button>
            </div>
            
            <section className="bg-gradient-to-br from-green-600 to-green-800 py-12 text-white rounded-xl">
              <div className="container mx-auto px-4">
                {news.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                      <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white text-gray-800">
                        {item.image && (
                          <div className="relative h-40 overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex gap-2 mb-3">
                            {item.published && (
                              <Badge className="bg-green-500 text-white text-xs">Publicado</Badge>
                            )}
                            {item.featured && (
                              <Badge className="bg-yellow-500 text-white text-xs">Destacado</Badge>
                            )}
                            {!item.published && (
                              <Badge variant="secondary" className="text-xs">Borrador</Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.summary || item.content?.substring(0, 100)}
                          </p>
                          {item.author && (
                            <p className="text-xs text-gray-500 mb-3">Por: {item.author}</p>
                          )}
                          <div className="flex justify-center gap-2 mt-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openEditDialog(item, 'news')}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => openDeleteDialog(item, 'news')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/10 rounded-xl">
                    <FileText className="h-16 w-16 text-green-200 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No hay noticias</h3>
                    <p className="text-green-100 mt-2">Haz clic en "Agregar Noticia" para crear una nueva</p>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="eventos">
            {/* Botón para agregar evento */}
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => openAddDialog('event')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar Evento
              </Button>
            </div>
            
            <section className="bg-gradient-to-br from-green-600 to-green-800 py-12 text-white rounded-xl">
              <div className="container mx-auto px-4">
                {events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <Card key={event.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white text-gray-800">
                        <CardContent className="p-5">
                          {/* Badge */}
                          {event.eventType && (
                            <Badge variant="secondary" className="mb-3 bg-green-100 text-green-800">
                              {event.eventType}
                            </Badge>
                          )}
                          <h3 className="text-lg font-bold mb-2 line-clamp-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            {event.date && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-green-600" />
                                {new Date(event.date).toLocaleDateString('es-ES', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                                {event.location}
                              </div>
                            )}
                          </div>
                          <div className="flex justify-center gap-2 mt-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openEditDialog(event, 'event')}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => openDeleteDialog(event, 'event')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                        {/* Event image - Bottom */}
                        {event.image && (
                          <div className="relative h-40 overflow-hidden">
                            <img 
                              src={event.image} 
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/10 rounded-xl">
                    <Calendar className="h-16 w-16 text-green-200 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No hay eventos</h3>
                    <p className="text-green-100 mt-2">Haz clic en "Agregar Evento" para crear uno nuevo</p>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="patrocinadores">{renderDataList(sponsors as EditableItem[], 'sponsor')}</TabsContent>
          <TabsContent value="carrusel">{renderDataList(carouselSlides as EditableItem[], 'carousel')}</TabsContent>
          <TabsContent value="galeria">{renderDataList(galleryItems as EditableItem[], 'gallery')}</TabsContent>
          <TabsContent value="estadisticas">
            {/* Statistics File Upload Section */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Archivos de Estadísticas</h3>
                  <p className="text-sm text-gray-500">Sube archivos PDF con las tablas de posiciones y goleadores</p>
                </div>
                <Button onClick={() => setStatsUploadDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir PDF
                </Button>
              </div>

              {statisticsFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statisticsFiles.map((file) => (
                    <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <File className="h-6 w-6 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{file.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{file.fileName}</p>
                            {file.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{file.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => handleStatsPreview(file)} className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleStatsFileDelete(file.id)}
                            disabled={deletingStatsFileId === file.id}
                            className={deletingStatsFileId === file.id ? "opacity-50 cursor-not-allowed" : ""}
                          >
                            {deletingStatsFileId === file.id ? (
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay archivos de estadísticas</p>
                  <p className="text-sm text-gray-400">Sube un archivo PDF para comenzar</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="resoluciones">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Documentos y Resoluciones
                  </h3>
                  <p className="text-sm text-gray-500">Gestiona documentos oficiales, reglamentos y circulares</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setResUploadDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir PDF
                  </Button>
                  <Button onClick={() => openAddDialog('resolution')} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Manual
                  </Button>
                </div>
              </div>
              {resolutions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resolutions.map((r) => (
                    <div key={r.id}>
                      {renderCard(r, 'resolution')}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay documentos registrados</p>
                  <p className="text-sm text-gray-400 mt-2">Sube un archivo PDF para comenzar</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="documentos">
            <div className="space-y-6">
              {/* Cronogramas */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Cronogramas
                    </h3>
                    <p className="text-sm text-gray-500">Archivos de programación de partidos y eventos</p>
                  </div>
                  <Button onClick={() => setUploadDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </div>
                {scheduleFiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scheduleFiles.map((file) => (
                      <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <File className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">{file.name}</h4>
                              <p className="text-sm text-gray-500 truncate">{file.fileName}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {file.fileType.toUpperCase()} • {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(file)}
                              className="flex-1"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleFileDelete(file.id)}
                              disabled={deletingFileId === file.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <File className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay cronogramas subidos</p>
                    <p className="text-sm text-gray-400 mt-2">Sube un archivo PDF para comenzar</p>
                  </div>
                )}
              </div>

              {/* Estadísticas */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Archivos de Estadísticas
                    </h3>
                    <p className="text-sm text-gray-500">Tablas de posiciones, goleadores y estadísticas generales</p>
                  </div>
                  <Button onClick={() => setStatsUploadDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir PDF
                  </Button>
                </div>
                {statisticsFiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statisticsFiles.map((file) => (
                      <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <File className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">{file.name}</h4>
                              <p className="text-sm text-gray-500 truncate">{file.fileName}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {file.fileType.toUpperCase()} • {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatsPreview(file)}
                              className="flex-1"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatsFileDelete(file.id)}
                              disabled={deletingStatsFileId === file.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No hay archivos de estadísticas</p>
                    <p className="text-sm text-gray-400 mt-2">Sube un archivo PDF para comenzar</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar {selectedType}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {renderFormFields(editForm, setEditForm, selectedType)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditSave} className="bg-green-600 hover:bg-green-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar {selectedType}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {renderFormFields(addForm, setAddForm, selectedType)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddSave} className="bg-green-600 hover:bg-green-700">Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="py-4">¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload File Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Subir Programación de Partidos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre del Documento *</Label>
              <Input
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                placeholder="Ej: Programación Torneo Apertura"
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Breve descripción de la programación"
              />
            </div>
            <div className="space-y-2">
              <Label>Archivo PDF *</Label>
              <input
                key={fileInputKey}
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : 'Seleccionar Archivo PDF'}
              </Button>
              {selectedFile && (
                <p className="text-xs text-gray-500 text-center">
                  Tamaño: {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setUploadDialogOpen(false);
              setSelectedFile(null);
              setUploadForm({ name: '', description: '' });
              setFileInputKey(prev => prev + 1);
            }}>Cancelar</Button>
            <Button onClick={handleFileUpload} disabled={!selectedFile || uploading} className="bg-green-600 hover:bg-green-700">
              {uploading ? 'Subiendo...' : 'Subir PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview File Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{previewFile?.name}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setPreviewDialogOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="py-4">
            {previewFile?.fileData && (
              <iframe
                src={previewFile.fileData}
                className="w-full h-[70vh] rounded-lg border"
                title="PDF Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Statistics Upload File Dialog */}
      <Dialog open={statsUploadDialogOpen} onOpenChange={setStatsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Subir Archivo de Estadísticas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre del Archivo</Label>
              <Input
                value={statsUploadForm.name}
                onChange={(e) => setStatsUploadForm({ ...statsUploadForm, name: e.target.value })}
                placeholder="Ej: Tabla de Posiciones Primera A"
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Textarea
                value={statsUploadForm.description}
                onChange={(e) => setStatsUploadForm({ ...statsUploadForm, description: e.target.value })}
                placeholder="Breve descripción del archivo"
              />
            </div>
            <div className="space-y-2">
              <Label>Archivo PDF *</Label>
              <input
                key={statsFileInputKey}
                ref={statsFileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleStatsFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => statsFileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {statsSelectedFile ? statsSelectedFile.name : 'Seleccionar Archivo PDF'}
              </Button>
              {statsSelectedFile && (
                <p className="text-xs text-gray-500 text-center">
                  Tamaño: {(statsSelectedFile.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setStatsUploadDialogOpen(false);
              setStatsSelectedFile(null);
              setStatsUploadForm({ name: '', description: '' });
              setStatsFileInputKey(prev => prev + 1);
            }}>Cancelar</Button>
            <Button onClick={handleStatsFileUpload} disabled={!statsSelectedFile || statsUploading} className="bg-green-600 hover:bg-green-700">
              {statsUploading ? 'Subiendo...' : 'Subir PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Preview File Dialog */}
      <Dialog open={statsPreviewDialogOpen} onOpenChange={setStatsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{statsPreviewFile?.name}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setStatsPreviewDialogOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          <div className="py-4">
            {statsPreviewFile?.fileData && (
              <iframe
                src={statsPreviewFile.fileData}
                className="w-full h-[70vh] rounded-lg border"
                title="PDF Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Resolution Upload File Dialog */}
      <Dialog open={resUploadDialogOpen} onOpenChange={setResUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Subir Documento PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título del Documento *</Label>
              <Input
                value={resUploadForm.title}
                onChange={(e) => setResUploadForm({ ...resUploadForm, title: e.target.value })}
                placeholder="Ej: Resolución de Sanciones"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={resUploadForm.type} onValueChange={(v) => setResUploadForm({ ...resUploadForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reglamento">Reglamento</SelectItem>
                    <SelectItem value="resolucion">Resolución</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                    <SelectItem value="acta">Acta</SelectItem>
                    <SelectItem value="calendario">Calendario</SelectItem>
                    <SelectItem value="sancion">Sanción</SelectItem>
                    <SelectItem value="protocolo">Protocolo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input
                  value={resUploadForm.number}
                  onChange={(e) => setResUploadForm({ ...resUploadForm, number: e.target.value })}
                  placeholder="Ej: RG-001-2025"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Textarea
                value={resUploadForm.description}
                onChange={(e) => setResUploadForm({ ...resUploadForm, description: e.target.value })}
                placeholder="Breve descripción del documento"
              />
            </div>
            <div className="space-y-2">
              <Label>Archivo PDF *</Label>
              <input
                key={resFileInputKey}
                ref={resFileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleResFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => resFileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {resSelectedFile ? resSelectedFile.name : 'Seleccionar Archivo PDF'}
              </Button>
              {resSelectedFile && (
                <p className="text-xs text-gray-500 text-center">
                  Tamaño: {(resSelectedFile.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setResUploadDialogOpen(false);
              setResSelectedFile(null);
              setResUploadForm({ title: '', type: 'resolucion', number: '', description: '' });
              setResFileInputKey(prev => prev + 1);
            }}>Cancelar</Button>
            <Button onClick={handleResFileUpload} disabled={!resSelectedFile || resUploading} className="bg-blue-600 hover:bg-blue-700">
              {resUploading ? 'Subiendo...' : 'Subir Documento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
