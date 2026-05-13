import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const damage = await db.pageDamage.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(damage);
  } catch (error) {
    console.error("Error updating page damage:", error);
    return NextResponse.json({ error: "Error updating damage" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Mark as inactive instead of deleting
    await db.pageDamage.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error fixing page damage:", error);
    return NextResponse.json({ error: "Error fixing damage" }, { status: 500 });
  }
}
