#!/bin/sh
set -e

echo "🌱 Initializing database..."

# Copy existing db if it exists, otherwise seed
if [ -f /data/custom.db ]; then
  echo "✅ Existing database found"
else
  echo "📄 No database found, seeding..."
  mkdir -p /data
  npx prisma db push --skip-generate
  npx tsx prisma/seed.ts
  echo "✅ Database seeded"
fi

echo "🚀 Starting server..."
exec node server.js
