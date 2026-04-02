# 📋 Guía de Respaldo y Trabajo Local - Liga Caldense de Fútbol

## 🎯 Resumen
Esta guía le permitirá mantener una copia local del proyecto y sincronizarla con GitHub para no perder su trabajo.

---

## 1️⃣ CLONAR EL PROYECTO EN SU COMPUTADORA LOCAL

### Paso 1: Instalar Requisitos
Asegúrese de tener instalado:
- **Node.js 20+** (descargar de nodejs.org)
- **Bun** (opcional, pero recomendado): `npm install -g bun`
- **Git**: `git --version` (debe estar instalado)
- **Visual Studio Code**

### Paso 2: Clonar el Repositorio
Abra una terminal en la carpeta donde quiera guardar el proyecto:

```bash
# Clonar el repositorio
git clone https://github.com/eduadsonew-bit/LCF.git

# Entrar a la carpeta
cd LCF

# Instalar dependencias
npm install
# o si usa bun:
bun install
```

### Paso 3: Configurar la Base de Datos
```bash
# Generar el cliente de Prisma
npx prisma generate

# Crear la base de datos
npx prisma db push
```

### Paso 4: Descargar la Base de Datos con Datos
La base de datos con todos los datos está en el repositorio original.
Descargue el archivo `custom.db` y colóquelo en la carpeta `db/`:

```bash
# Crear carpeta db si no existe
mkdir -p db

# Descargar la base de datos (2MB)
curl -L -o db/custom.db "https://raw.githubusercontent.com/eduadionew-bit/LCF/main/db/custom.db"
```

### Paso 5: Ejecutar el Proyecto Localmente
```bash
# Con npm
npm run dev

# Con bun
bun run dev
```

El proyecto estará disponible en: **http://localhost:3000**

---

## 2️⃣ FLUJO DE TRABAJO SEGURO CON GIT

### Antes de Empezar a Trabajar
```bash
# Traer los últimos cambios del repositorio
git pull origin main
```

### Después de Hacer Cambios
```bash
# Ver qué archivos modificó
git status

# Agregar todos los cambios
git add .

# Crear un commit con un mensaje descriptivo
git commit -m "Descripción de los cambios realizados"

# Subir cambios a GitHub
git push origin main
```

---

## 3️⃣ RESPALDO DE LA BASE DE DATOS

### Exportar Base de Datos
```bash
# Crear respaldo de la base de datos
cp db/custom.db backups/custom_$(date +%Y%m%d_%H%M%S).db

# O usando sqlite3 para exportar a SQL
sqlite3 db/custom.db .dump > backups/backup_$(date +%Y%m%d).sql
```

### Importar Base de Datos
```bash
# Restaurar desde respaldo
cp backups/custom_YYYYMMDD_HHMMSS.db db/custom.db

# O desde SQL
sqlite3 db/custom.db < backups/backup_YYYYMMDD.sql
```

---

## 4️⃣ ESTRUCTURA DEL PROYECTO

```
LCF/
├── db/
│   └── custom.db          # Base de datos SQLite (¡RESPALDAR!)
├── prisma/
│   └── schema.prisma      # Esquema de la base de datos
├── public/
│   ├── downloads/         # Archivos descargables
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── api/           # Rutas API (backend)
│   │   ├── admin/         # Panel de administración
│   │   ├── page.tsx       # Página principal
│   │   └── ...            # Otras páginas
│   ├── components/        # Componentes React
│   └── lib/               # Utilidades
├── package.json           # Dependencias
└── tailwind.config.ts     # Configuración de estilos
```

---

## 5️⃣ IMÁGENES Y ARCHIVOS

### Ubicación de Imágenes
Las imágenes se almacenan en URLs externas (image2url.com) en la base de datos.
Si necesita cambiar esto:

1. **Opción A**: Usar un servicio de almacenamiento en la nube (Cloudinary, AWS S3)
2. **Opción B**: Guardar imágenes en `public/images/` y actualizar las URLs en la BD

### Respaldar Imágenes
Si tiene imágenes locales en `public/`:
```bash
# Crear respaldo de imágenes
tar -czvf backup_images_$(date +%Y%m%d).tar.gz public/
```

---

## 6️⃣ SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error: "Database connection failed"
```bash
# Verificar que la base de datos existe
ls -la db/custom.db

# Regenerar Prisma
npx prisma generate
```

### Error: "Port 3000 already in use"
```bash
# Encontrar y matar el proceso
lsof -i :3000
kill -9 <PID>
```

---

## 7️⃣ SINCRONIZACIÓN ENTRE ENTORNOS

### Escenario: Trabaja en Z.ai y quiere continuar en local

1. **En Z.ai**: Haga commit y push de sus cambios
   ```bash
   git add .
   git commit -m "Cambios desde Z.ai"
   git push origin main
   ```

2. **En Local**: Traiga los cambios
   ```bash
   git pull origin main
   ```

3. **Base de datos**: Si hizo cambios en la BD, expórtela e impórtela

---

## 8️⃣ COMANDOS RÁPIDOS

| Acción | Comando |
|--------|---------|
| Iniciar servidor | `npm run dev` o `bun run dev` |
| Ver errores de código | `npm run lint` |
| Actualizar base de datos | `npx prisma db push` |
| Crear respaldo BD | `cp db/custom.db backups/custom_$(date +%Y%m%d).db` |
| Subir cambios | `git add . && git commit -m "mensaje" && git push` |
| Traer cambios | `git pull origin main` |

---

## 9️⃣ RECOMENDACIONES FINALES

1. ✅ **Haga commits frecuentes** con mensajes descriptivos
2. ✅ **Respalde la base de datos** antes de cambios importantes
3. ✅ **Use ramas** para experimentos: `git checkout -b experimento`
4. ✅ **Mantenga sincronizado** su repositorio local con GitHub
5. ✅ **Documente cambios importantes** en un archivo CHANGELOG.md

---

## 📞 SOPORTE

Si tiene problemas:
1. Revise los logs del servidor: `tail -f dev.log`
2. Verifique la consola del navegador (F12)
3. Consulte la documentación de Next.js: https://nextjs.org/docs

---

*Última actualización: $(date)*
