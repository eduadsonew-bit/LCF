import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Get client IP from request headers
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

// Block duration in minutes
const BLOCK_DURATION_MINUTES = 30;
const MAX_ATTEMPTS = 3;

// Create a fresh Prisma client for each request
function getDb() {
  return new PrismaClient();
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const clientIp = getClientIp(request);
  
  try {
    // Check if IP is blocked
    const loginAttempt = await db.loginAttempt.findUnique({
      where: { ipAddress: clientIp },
    });

    if (loginAttempt?.blockedUntil && new Date(loginAttempt.blockedUntil) > new Date()) {
      const remainingMinutes = Math.ceil(
        (new Date(loginAttempt.blockedUntil).getTime() - Date.now()) / 60000
      );
      return NextResponse.json({ 
        error: `Acceso bloqueado. Contacte al desarrollador. Intente nuevamente en ${remainingMinutes} minutos.`,
        blocked: true,
        remainingMinutes
      }, { status: 429 });
    }

    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: 'PIN es requerido' }, { status: 400 });
    }

    const admin = await db.adminUser.findUnique({
      where: { pin },
    });

    if (!admin) {
      // Increment failed attempts
      const currentAttempts = loginAttempt?.attempts || 0;
      const newAttempts = currentAttempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        // Block the IP
        const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);
        
        await db.loginAttempt.upsert({
          where: { ipAddress: clientIp },
          update: { 
            attempts: newAttempts, 
            blockedUntil,
            updatedAt: new Date()
          },
          create: {
            ipAddress: clientIp,
            attempts: newAttempts,
            blockedUntil,
          },
        });

        return NextResponse.json({ 
          error: 'Acceso bloqueado. Ha excedido el número máximo de intentos. Contacte al desarrollador.',
          blocked: true
        }, { status: 429 });
      }

      // Update attempts count
      await db.loginAttempt.upsert({
        where: { ipAddress: clientIp },
        update: { 
          attempts: newAttempts,
          updatedAt: new Date()
        },
        create: {
          ipAddress: clientIp,
          attempts: newAttempts,
        },
      });

      const remaining = MAX_ATTEMPTS - newAttempts;
      return NextResponse.json({ 
        error: `PIN inválido. Intentos restantes: ${remaining}`,
        attemptsRemaining: remaining
      }, { status: 401 });
    }

    // Successful login - reset attempts
    if (loginAttempt) {
      await db.loginAttempt.update({
        where: { ipAddress: clientIp },
        data: { 
          attempts: 0, 
          blockedUntil: null,
          updatedAt: new Date()
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
