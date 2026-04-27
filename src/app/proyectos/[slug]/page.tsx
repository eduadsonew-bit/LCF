"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { slug } = await params;
        const res = await fetch("/api/public/projects/" + slug);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </SiteLayout>
    );
  }

  if (!project) {
    return (
      <SiteLayout>
        <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-sm text-green-200 mb-2">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <span className="mx-2">&gt;</span>
              <Link href="/proyectos" className="hover:text-white transition-colors">Proyectos</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-white">No encontrado</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "#fcd34d" }}>
              Proyecto no encontrado
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 mb-6">El proyecto que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push("/proyectos")} className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Proyectos
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Green gradient header */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-sm text-green-200 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/proyectos" className="hover:text-white transition-colors">Proyectos</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{project.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "#fcd34d" }}>
            {project.title}
          </h1>
          {project.category && (
            <p className="text-green-100 mt-2 text-lg">{project.category}</p>
          )}
        </div>
      </div>

      {/* Project content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button
            variant="outline"
            onClick={() => router.push("/proyectos")}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Proyectos
          </Button>

          {/* Project image */}
          {project.image && (
            <div className="w-full mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Project description */}
          {project.description && (
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Project content as HTML */}
          {project.content && (
            <div
              className="prose prose-lg max-w-none text-gray-800 mt-8"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
