import { NextRequest, NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/db-write';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    const data = await request.json();
    const match = await prisma.match.update({
      where: { id },
      data: {
        tournamentId: data.tournamentId || null,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        matchDate: data.matchDate ? new Date(data.matchDate) : null,
        venue: data.venue,
        status: data.status,
        homeTeamLogo: data.homeTeamLogo,
        awayTeamLogo: data.awayTeamLogo,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al actualizar partido' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = getWriteClient();
  try {
    const { id } = await params;
    await prisma.match.delete({ where: { id } });
    await prisma.$disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting match:', error);
    await prisma.$disconnect();
    return NextResponse.json({ error: 'Error al eliminar partido' }, { status: 500 });
  }
}
