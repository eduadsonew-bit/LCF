import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a fresh Prisma client for each request
function getDb() {
  return new PrismaClient();
}

// This endpoint is only accessible by dev role users
export async function GET(request: NextRequest) {
  const db = getDb();
  try {
    // Get all login attempts with failed login info
    const loginAttempts = await db.loginAttempt.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(loginAttempts);
  } catch (error) {
    console.error('Error fetching login attempts:', error);
    return NextResponse.json({ error: 'Error al obtener intentos de login' }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}

// Delete a login attempt (unblock an IP)
export async function DELETE(request: NextRequest) {
  const db = getDb();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await db.loginAttempt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting login attempt:', error);
    return NextResponse.json({ error: 'Error al eliminar intento de login' }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
