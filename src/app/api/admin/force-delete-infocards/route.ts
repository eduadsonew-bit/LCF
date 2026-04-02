import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  // Probar ambas bases de datos
  const prismaOld = new PrismaClient({
    datasources: { db: { url: 'file:/home/z/my-project/db/custom.db' } }
  });
  const prismaNew = new PrismaClient({
    datasources: { db: { url: 'file:/home/z/my-project/db/lcf_new.db' } }
  });
  
  try {
    // Verificar custom.db
    const oldCards = await prismaOld.infoCard.findMany();
    
    // Verificar lcf_new.db
    const newCards = await prismaNew.infoCard.findMany();
    
    // Eliminar de custom.db
    const deleteOld = await prismaOld.infoCard.deleteMany({});
    
    // Eliminar de lcf_new.db
    const deleteNew = await prismaNew.infoCard.deleteMany({});
    
    await prismaOld.$disconnect();
    await prismaNew.$disconnect();
    
    return NextResponse.json({ 
      customDb: { before: oldCards.length, deleted: deleteOld.count },
      lcfNewDb: { before: newCards.length, deleted: deleteNew.count }
    });
  } catch (error) {
    console.error('Error:', error);
    await prismaOld.$disconnect();
    await prismaNew.$disconnect();
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
