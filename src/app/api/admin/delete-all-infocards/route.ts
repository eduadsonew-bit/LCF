import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function DELETE() {
  // Eliminar de lcfdata.db (la base de datos activa)
  const prisma = new PrismaClient({
    datasources: { db: { url: 'file:/home/z/my-project/db/lcfdata.db' } }
  });

  try {
    const result = await prisma.infoCard.deleteMany({});
    await prisma.$disconnect();
    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
