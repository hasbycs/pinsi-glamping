import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const data = await prisma.popupImage.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const data = await prisma.popupImage.create({
    data: {
      title: String(body.title ?? ""),
      imageUrl: String(body.imageUrl ?? ""),
      buttonLabel: String(body.buttonLabel ?? "Lihat Promo"),
      buttonUrl: String(body.buttonUrl ?? "#"),
      isActive: Boolean(body.isActive ?? true),
      sortOrder: Number(body.sortOrder ?? 0),
    },
  });
  return NextResponse.json({ data });
}
