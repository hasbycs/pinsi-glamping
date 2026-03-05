import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const data = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();
  const data = await prisma.testimonial.create({
    data: {
      guestName: String(body.guestName ?? ""),
      guestOrigin: String(body.guestOrigin ?? ""),
      quote: String(body.quote ?? ""),
      rating: Number(body.rating ?? 5),
      isPublished: Boolean(body.isPublished ?? true),
    },
  });
  return NextResponse.json({ data });
}
