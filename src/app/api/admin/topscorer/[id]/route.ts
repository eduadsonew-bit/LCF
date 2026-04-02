import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    const data = await request.json();
    
    const topScorer = await db.topScorer.update({
      where: { id },
      data: {
        name: data.name,
        team: data.team,
        goals: parseInt(data.goals) || 0,
        assists: parseInt(data.assists) || 0,
        category: data.category,
        order: parseInt(data.order) || 0,
        active: data.active,
      },
    });
    return NextResponse.json(topScorer);
  } catch (error) {
    console.error('Error updating top scorer:', error);
    return NextResponse.json({ error: 'Error al actualizar goleador' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    
    await db.topScorer.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting top scorer:', error);
    return NextResponse.json({ error: 'Error al eliminar goleador' }, { status: 500 });
  }
}
