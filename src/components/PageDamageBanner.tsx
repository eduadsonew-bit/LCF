"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, XCircle } from "lucide-react";

interface PageDamage {
  id: string;
  page: string;
  damageType: string;
  message: string;
  active: boolean;
}

export default function PageDamageBanner() {
  const pathname = usePathname();
  const [damages, setDamages] = useState<PageDamage[]>([]);

  useEffect(() => {
    const fetchDamages = async () => {
      try {
        const res = await fetch("/api/public/page-status?page=" + pathname);
        if (res.ok) {
          const data = await res.json();
          setDamages(data);
        }
      } catch {
        // silently fail
      }
    };
    fetchDamages();
  }, [pathname]);

  if (damages.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] space-y-0">
      {damages.map((damage) => (
        <div
          key={damage.id}
          className={
            "w-full px-4 py-3 text-center text-sm font-medium " +
            (damage.damageType === "collapse"
              ? "bg-red-600 text-white"
              : damage.damageType === "warning"
              ? "bg-yellow-500 text-yellow-950"
              : "bg-orange-500 text-white")
          }
        >
          <div className="flex items-center justify-center gap-2">
            {damage.damageType === "collapse" ? (
              <XCircle className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            <span>{damage.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
