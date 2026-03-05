import type { LandingContent } from "@prisma/client";

export const landingDefault: Omit<LandingContent, "updatedAt"> = {
  id: 1,
  siteName: "Pinsi Glamping",
  heroTagline: "Glamping Premium Tepi Sungai",
  heroTitle: "Nikmati Malam Hangat, Alam Sejuk, dan Sungai yang Menenangkan",
  heroSubtitle:
    "Tempat wisata glamping di tepi sungai dengan aktivitas keluarga, outbound, kuliner, dan spot foto modern.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1800&q=80",
  ctaPrimary: "Booking Sekarang",
  ctaSecondary: "Lihat Fasilitas",
  aboutTitle: "Liburan Lengkap dalam Satu Lokasi",
  aboutBody:
    "Selain Pinsi Glamping, kami punya area api unggun, wahana anak, rafting ringan, ATV, resto tepi sungai, dan venue gathering.",
  contactPhone: "+62 812-3456-7890",
  contactEmail: "halo@pinsiglamping.id",
};
