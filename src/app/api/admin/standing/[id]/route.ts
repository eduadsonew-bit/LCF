import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    const data = await request.json();
    
    const standing = await db.standing.update({
      where: { id },
      data: {
        teamName: data.teamName,
        teamLogo: data.teamLogo,
        category: data.category,
        played: parseInt(data.played) || 0,
        won: parseInt(data.won) || 0,
        drawn: parseInt(data.drawn) || 0,
        lost: parseInt(data.lost) || 0,
        goalsFor: parseInt(data.goalsFor) || 0,
        goalsAgainst: parseInt(data.goalsAgainst) || 0,
        points: parseInt(data.points) || 0,
        order: parseInt(data.order) || 0,
        active: data.active,
      },
    });
    return NextResponse.json(standing);
  } catch (error) {
    console.error('Error updating standing:', error);
    return NextResponse.json({ error: 'Error al actualizar posición' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
    
    await db.standing.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting standing:', error);
    return NextResponse.json({ error: 'Error al eliminar posición' }, { status: 500 });
  }
}
