import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureLandingContent } from "@/lib/landing";

export async function GET() {
  const landing = await ensureLandingContent();
  const [facilities, attractions, testimonials, popupImages] = await Promise.all([
    prisma.facility.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    prisma.attraction.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" } }),
    prisma.popupImage.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({
    landing,
    facilities,
    attractions,
    testimonials,
    popupImages,
  });
}
