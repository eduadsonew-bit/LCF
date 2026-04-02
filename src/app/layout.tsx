import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "LCF - Liga de Fútbol",
  description: "Liga de Fútbol - Torneos, Programación, Trámites y más",
  keywords: ["LCF", "Fútbol", "Torneos", "Liga", "Deportes"],
  authors: [{ name: "LCF Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${roboto.variable} font-sans antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Roboto', sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
