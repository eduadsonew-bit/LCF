import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Check if project exists
    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // If title changed, regenerate slug
    const updateData: Record<string, unknown> = {};
    if (data.title && data.title !== existing.title) {
      updateData.title = data.title;
      updateData.slug = generateSlug(data.title);
    } else {
      updateData.title = data.title;
    }
    updateData.description = data.description !== undefined ? data.description : undefined;
    updateData.content = data.content !== undefined ? data.content : undefined;
    updateData.image = data.image !== undefined ? data.image : undefined;
    updateData.category = data.category !== undefined ? data.category : undefined;
    updateData.status = data.status !== undefined ? data.status : undefined;
    updateData.order = data.order !== undefined ? data.order : undefined;
    updateData.active = data.active !== undefined ? data.active : undefined;

    // Remove undefined values
    const cleanData: Record<string, unknown> = {};
    for (const key of Object.keys(updateData)) {
      if (updateData[key] !== undefined) {
        cleanData[key] = updateData[key];
      }
    }

    const project = await db.project.update({
      where: { id },
      data: cleanData,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Error al eliminar proyecto' }, { status: 500 });
  }
}
