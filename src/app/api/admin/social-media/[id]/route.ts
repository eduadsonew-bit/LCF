import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const socialMedia = await db.socialMedia.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error updating social media:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.socialMedia.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting social media:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
