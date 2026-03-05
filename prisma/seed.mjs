import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.landingContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Pinsi Glamping",
      heroTagline: "Glamping Premium Tepi Sungai",
      heroTitle: "Menyatu Dengan Alam, Tetap Nyaman Seperti Hotel",
      heroSubtitle:
        "Nikmati pengalaman glamping tepi sungai dengan fasilitas lengkap untuk keluarga, komunitas, dan corporate outing.",
      heroImageUrl:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=80",
      ctaPrimary: "Reservasi",
      ctaSecondary: "Jelajahi Fasilitas",
      aboutTitle: "Lebih dari Sekadar Glamping",
      aboutBody:
        "Pinsi Glamping menyatukan penginapan alam, wahana wisata keluarga, dan aktivitas seru dalam satu kawasan.",
      contactPhone: "+62 812-3456-7890",
      contactEmail: "booking@pinsiglamping.id",
    },
  });

  const facilities = [
    { title: "Tenda Premium", description: "Kasur hotel, kamar mandi air hangat, private deck.", sortOrder: 1 },
    { title: "Rafting Ringan", description: "Aktivitas sungai aman untuk keluarga dan pemula.", sortOrder: 2 },
    { title: "Area Api Unggun", description: "Malam keakraban dengan live music dan BBQ.", sortOrder: 3 },
  ];

  for (const item of facilities) {
    await prisma.facility.create({ data: { ...item, icon: "Tent", isPublished: true } });
  }

  await prisma.attraction.create({
    data: {
      title: "Sunrise Deck Pinsi",
      location: "Ciwidey",
      description: "Spot favorit menikmati sunrise dengan kabut pagi pegunungan.",
      imageUrl: "https://images.unsplash.com/photo-1532274402917-5aadf880af5f?auto=format&fit=crop&w=1400&q=80",
      priceFrom: 250000,
      sortOrder: 1,
      isPublished: true,
    },
  });

  await prisma.testimonial.create({
    data: {
      guestName: "Nadia",
      guestOrigin: "Bandung",
      quote: "Anak-anak happy banget, staff ramah, dan view sungainya cantik.",
      rating: 5,
      isPublished: true,
    },
  });

  await prisma.popupImage.createMany({
    data: [
      {
        title: "Promo Early Booking 20%",
        imageUrl:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
        buttonLabel: "Ambil Promo",
        buttonUrl: "#kontak",
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "Paket Family Weekend",
        imageUrl:
          "https://images.unsplash.com/photo-1510312305653-8ed496efafd6?auto=format&fit=crop&w=1400&q=80",
        buttonLabel: "Lihat Paket",
        buttonUrl: "#fasilitas",
        sortOrder: 2,
        isActive: true,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
