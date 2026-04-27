import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LCF Admin - Panel de Administración",
  description: "Panel de administración de la Liga Caldense de Fútbol",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
