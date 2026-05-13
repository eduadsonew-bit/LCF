import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const damages = await db.pageDamage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(damages);
  } catch (error) {
    console.error("Error fetching page damages:", error);
    return NextResponse.json({ error: "Error fetching damages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page, damageType, message } = body;

    if (!page || !message) {
      return NextResponse.json({ error: "Page and message are required" }, { status: 400 });
    }

    const damage = await db.pageDamage.create({
      data: {
        page,
        damageType: damageType || "warning",
        message,
        active: true,
      },
    });

    return NextResponse.json(damage, { status: 201 });
  } catch (error) {
    console.error("Error creating page damage:", error);
    return NextResponse.json({ error: "Error creating damage" }, { status: 500 });
  }
}
