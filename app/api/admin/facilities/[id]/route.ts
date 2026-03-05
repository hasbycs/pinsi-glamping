import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body = await req.json();

  const data = await prisma.facility.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      description: body.description,
      icon: body.icon,
      sortOrder: body.sortOrder,
      isPublished: body.isPublished,
    },
  });

  return NextResponse.json({ data });
}

export async function DELETE(_: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  await prisma.facility.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
