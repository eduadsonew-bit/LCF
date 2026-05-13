import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    if (!page) {
      return NextResponse.json({ error: "Page parameter is required" }, { status: 400 });
    }

    const damages = await db.pageDamage.findMany({
      where: {
        page,
        active: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(damages);
  } catch (error) {
    console.error("Error fetching page status:", error);
    return NextResponse.json({ error: "Error fetching status" }, { status: 500 });
  }
}
