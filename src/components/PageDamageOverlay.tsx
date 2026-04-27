"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

interface PageDamage {
  id: string;
  page: string;
  damageType: string;
  message: string;
  active: boolean;
  createdAt: string;
}

export default function PageDamageOverlay() {
  const pathname = usePathname();
  const [damages, setDamages] = useState<PageDamage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDamages = async () => {
      try {
        const res = await fetch("/api/public/damages?page=" + encodeURIComponent(pathname));
        if (res.ok) {
          const data = await res.json();
          setDamages(data);
        }
      } catch (error) {
        console.error("Error fetching damages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDamages();
  }, [pathname]);

  if (loading) return null;
  if (damages.length === 0) return null;

  const collapseDamages = damages.filter((d) => d.damageType === "collapse");
  const warningDamages = damages.filter((d) => d.damageType === "warning");
  const customDamages = damages.filter((d) => d.damageType === "custom");

  return (
    <>
      {/* COLAPSO - Cubre TODA la pagina, inservible */}
      {collapseDamages.length > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-4xl mx-4">
            {collapseDamages.map((damage) => (
              <div
                key={damage.id}
                className="bg-gradient-to-br from-red-900 via-red-800 to-red-950 border-2 border-red-500 rounded-2xl p-8 md:p-12 shadow-2xl shadow-red-900/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-400">
                    <ShieldAlert className="w-10 h-10 md:w-12 md:h-12 text-red-300" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-black text-red-200 tracking-tight">
                      SITIO NO DISPONIBLE
                    </h1>
                    <p className="text-red-400 text-sm md:text-base mt-1">
                      Página en mantenimiento o con errores críticos
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent mb-6" />
                <div className="bg-red-950/50 rounded-xl p-6 md:p-8 border border-red-800/50">
                  <p className="text-lg md:text-2xl lg:text-3xl text-red-100 leading-relaxed whitespace-pre-wrap break-words font-medium">
                    {damage.message}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-red-500/70 text-xs">
                  <span>Daño ID: {damage.id.substring(0, 8)}</span>
                  <span>
                    {new Date(damage.createdAt).toLocaleString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WARNING - Banner grande arriba */}
      {warningDamages.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[9998]">
          {warningDamages.map((damage) => (
            <div
              key={damage.id}
              className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black shadow-lg shadow-amber-900/30"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-black/10 rounded-full flex items-center justify-center mt-1">
                    <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-2xl font-black tracking-tight">
                      ADVERTENCIA
                    </h2>
                    <p className="text-base md:text-xl mt-1 leading-relaxed whitespace-pre-wrap break-words">
                      {damage.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="h-[180px] md:h-[200px]" />
        </div>
      )}

      {/* CUSTOM - Aviso inferior */}
      {customDamages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[9997]">
          {customDamages.map((damage) => (
            <div
              key={damage.id}
              className="bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 border-t-2 border-blue-500 shadow-2xl shadow-slate-900/50"
            >
              <div className="max-w-7xl mx-auto px-4 py-5 md:py-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <Info className="w-6 h-6 md:w-7 md:h-7 text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-xl font-bold text-blue-200">
                      AVISO DEL SISTEMA
                    </h2>
                    <p className="text-sm md:text-lg mt-1 leading-relaxed text-blue-100/90 whitespace-pre-wrap break-words">
                      {damage.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
