import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function DELETE() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: 'file:/home/z/my-project/db/lcf_new.db' },
    },
  });
  try {
    const result = await prisma.infoCard.deleteMany({});
    await prisma.$disconnect();
    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
