"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SiteLayout from "@/components/SiteLayout";

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

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/public/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <SiteLayout>
      {/* Green gradient header */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-sm text-green-200 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">Proyectos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "#fcd34d" }}>
            Proyectos
          </h1>
          <p className="text-green-100 mt-2 text-lg max-w-2xl">
            Conoce los proyectos que llevamos a cabo en la Liga Caldense de F&uacute;tbol
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={"/proyectos/" + project.slug}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer group">
                  {project.image ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <FolderOpen className="h-16 w-16 text-green-400" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {project.category && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          {project.category}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-xl">
            <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No hay proyectos disponibles</h3>
            <p className="text-gray-400 mt-2">Pronto publicaremos nuevos proyectos</p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
