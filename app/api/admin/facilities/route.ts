import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const data = await prisma.facility.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const data = await prisma.facility.create({
    data: {
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
      icon: String(body.icon ?? "Tent"),
      sortOrder: Number(body.sortOrder ?? 0),
      isPublished: Boolean(body.isPublished ?? true),
    },
  });
  return NextResponse.json({ data });
}
