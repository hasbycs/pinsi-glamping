import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureLandingContent } from "@/lib/landing";
import { requireAdmin } from "@/lib/api";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const landing = await ensureLandingContent();
  return NextResponse.json({ data: landing });
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await req.json();

  const updated = await prisma.landingContent.upsert({
    where: { id: 1 },
    update: {
      siteName: String(body.siteName ?? ""),
      heroTagline: String(body.heroTagline ?? ""),
      heroTitle: String(body.heroTitle ?? ""),
      heroSubtitle: String(body.heroSubtitle ?? ""),
      heroImageUrl: String(body.heroImageUrl ?? ""),
      ctaPrimary: String(body.ctaPrimary ?? ""),
      ctaSecondary: String(body.ctaSecondary ?? ""),
      aboutTitle: String(body.aboutTitle ?? ""),
      aboutBody: String(body.aboutBody ?? ""),
      contactPhone: String(body.contactPhone ?? ""),
      contactEmail: String(body.contactEmail ?? ""),
    },
    create: {
      id: 1,
      siteName: String(body.siteName ?? ""),
      heroTagline: String(body.heroTagline ?? ""),
      heroTitle: String(body.heroTitle ?? ""),
      heroSubtitle: String(body.heroSubtitle ?? ""),
      heroImageUrl: String(body.heroImageUrl ?? ""),
      ctaPrimary: String(body.ctaPrimary ?? ""),
      ctaSecondary: String(body.ctaSecondary ?? ""),
      aboutTitle: String(body.aboutTitle ?? ""),
      aboutBody: String(body.aboutBody ?? ""),
      contactPhone: String(body.contactPhone ?? ""),
      contactEmail: String(body.contactEmail ?? ""),
    },
  });

  return NextResponse.json({ data: updated });
}
