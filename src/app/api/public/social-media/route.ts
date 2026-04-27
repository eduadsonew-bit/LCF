import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const socialMedia = await db.socialMedia.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json([], { status: 200 });
  }
}
