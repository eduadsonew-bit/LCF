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

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.title) {
      return NextResponse.json({ error: 'El t\u00edtulo es obligatorio' }, { status: 400 });
    }

    const slug = generateSlug(data.title);

    const project = await db.project.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description || null,
        content: data.content || null,
        image: data.image || null,
        category: data.category || null,
        status: data.status || 'active',
        order: data.order || 0,
        active: data.active ?? true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
  }
}
