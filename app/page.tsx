import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureLandingContent } from "@/lib/landing";
import { formatRupiah } from "@/lib/utils";
import { PopupModal } from "@/components/popup-modal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const landing = await ensureLandingContent();
  const [facilities, attractions, testimonials, popupImage] = await Promise.all([
    prisma.facility.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.attraction.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.popupImage.findFirst({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div>
      <PopupModal item={popupImage} />
      <header className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <nav className="flex items-center justify-between">
          <p className="text-xl font-bold text-teal-900">{landing.siteName}</p>
          <Link href="/admin" className="rounded-full border border-teal-700 px-4 py-2 text-sm font-semibold">
            Admin
          </Link>
        </nav>

        <section className="mt-12 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-canyon">{landing.heroTagline}</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">{landing.heroTitle}</h1>
            <p className="mt-4 text-slate-700">{landing.heroSubtitle}</p>
            <div className="mt-8 flex gap-3">
              <a href="#kontak" className="rounded-md bg-river px-5 py-3 text-sm font-semibold text-white">
                {landing.ctaPrimary}
              </a>
              <a href="#fasilitas" className="rounded-md border border-slate-400 px-5 py-3 text-sm font-semibold">
                {landing.ctaSecondary}
              </a>
            </div>
          </div>
          <img src={landing.heroImageUrl} alt={landing.heroTitle} className="h-[420px] w-full rounded-3xl object-cover shadow-2xl" />
        </section>
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-6 pb-20">
        <section id="fasilitas">
          <h2 className="text-3xl font-bold">{landing.aboutTitle}</h2>
          <p className="mt-2 max-w-3xl text-slate-700">{landing.aboutBody}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {facilities.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-lg font-semibold text-river">{item.title}</p>
                <p className="mt-2 text-sm text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Pilihan Wisata</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {attractions.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img src={item.imageUrl} alt={item.title} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-river">{item.location}</p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                  <p className="mt-4 text-sm font-semibold text-canyon">{formatRupiah(item.priceFrom)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Testimoni Pengunjung</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.id} className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                <p>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</p>
                <p className="mt-3 text-sm text-slate-700">"{item.quote}"</p>
                <p className="mt-3 text-sm font-semibold">{item.guestName} - {item.guestOrigin}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="kontak" className="rounded-2xl bg-river p-8 text-white">
          <h2 className="text-2xl font-bold">Hubungi Kami</h2>
          <p className="mt-2 text-sm text-teal-100">Telepon: {landing.contactPhone}</p>
          <p className="text-sm text-teal-100">Email: {landing.contactEmail}</p>
        </section>
      </main>
    </div>
  );
}
