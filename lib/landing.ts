import { prisma } from "@/lib/prisma";
import { landingDefault } from "@/lib/defaults";

export async function ensureLandingContent() {
  return prisma.landingContent.upsert({
    where: { id: 1 },
    update: {},
    create: landingDefault,
  });
}
