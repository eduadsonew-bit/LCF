---
Task ID: 1
Agent: Main Agent
Task: Restaurar proyecto completo LCF (Liga Caldense de Fútbol) desde GitHub

Work Log:
- Clonado repositorio https://github.com/eduadsonew-bit/LCF.git
- Analizada estructura completa del proyecto Next.js 16 + Prisma + Tailwind CSS 4 + shadcn/ui
- Copiados archivos de configuración: package.json, tsconfig.json, next.config.ts, postcss.config.mjs, tailwind.config.ts, components.json, eslint.config.mjs
- Copiado esquema Prisma (schema.prisma) con 15 modelos de datos
- Copiada base de datos SQLite con datos existentes (custom.db)
- Instaladas todas las dependencias con bun install (86 paquetes)
- Generado cliente Prisma y sincronizado schema con la base de datos
- Copiados todos los componentes UI de shadcn/ui (~40 componentes)
- Copiados componentes principales: SiteLayout, ExcelViewer, hooks, lib (db, db-write, utils)
- Copiadas todas las páginas: Home, Torneos, Programación (+Estadísticas, +Resoluciones), Noticias, Eventos, Nosotros (+Organización, +Documentos, +Clubes), Admin (+Layout, +Dev)
- Copiados todos los API routes públicos: carousel, matches, events, top-scorers, resolutions, sponsors, infocards, gallery, news, schedule-files, standings, statistics-files, tournaments
- Copiados todos los API routes de administración: tournament, team, schedule-file, statistics-file, carousel, standing, match, news, event, gallery, sponsor, infocard, topscorer, resolution, login, login-attempts
- Copiados estilos globales con efectos aurora/glow/particles
- Verificado que el servidor de desarrollo funciona correctamente (todas las APIs responden 200)

Stage Summary:
- Proyecto LCF completamente restaurado y funcional
- Servidor Next.js ejecutándose en puerto 3000
- Base de datos SQLite con datos existentes
- Todas las API routes públicas responden correctamente (200)
- Página principal carga con carousel, torneos, noticias, eventos, galería y patrocinadores
---
Task ID: 1
Agent: main
Task: Enable Excel upload in admin partidos section and public programacion page

Work Log:
- Read admin page `/src/app/admin/page.tsx` - identified PDF-only file selection and upload handlers
- Read public programacion page `/src/app/programacion/page.tsx` - identified PDF-only rendering
- Read API route `/src/app/api/public/schedule-files/[id]/content/route.ts` - found hardcoded `type: 'pdf'`
- Confirmed ExcelViewer component exists at `/src/components/ExcelViewer.tsx` and API at `/src/app/api/parse-excel-with-styles/route.ts`
- Modified `handleFileSelect` to accept `.pdf`, `.xlsx`, `.xls` extensions instead of only PDF MIME type
- Modified `handleFileUpload` to detect file type from extension and pass correct `fileType` to API
- Updated file input `accept` attribute from `.pdf` to `.pdf,.xlsx,.xls`
- Updated labels from "Archivo PDF" to "Archivo (PDF o Excel)"
- Updated button text from "Subir PDF" to "Subir Archivo"
- Added `ExcelViewer` import via dynamic import (no SSR) to admin page
- Updated preview dialog to render ExcelViewer for Excel files, iframe for PDFs
- Fixed API route to return `type: 'excel'` for non-PDF files instead of hardcoded `type: 'pdf'`
- Rewrote public `/programacion/page.tsx` with Excel/PDF auto-detection, conditional rendering
- Added Excel-specific icons (FileSpreadsheet), badges, and color theming in public page
- Verified build compiles successfully with no errors

Stage Summary:
- Admin panel now accepts PDF and Excel (.xlsx, .xls) files in the Cronogramas section
- Admin preview dialog shows ExcelViewer for Excel files, iframe for PDFs
- Public /programacion page auto-detects file type and renders accordingly
- API route correctly differentiates PDF vs Excel content type
- Prisma schema already supports any fileType string - no migration needed
