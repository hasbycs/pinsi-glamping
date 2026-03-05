"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LandingPayload } from "@/lib/types";

type Facility = {
  id: number;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  isPublished: boolean;
};
type Attraction = {
  id: number;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  priceFrom: number | null;
  sortOrder: number;
  isPublished: boolean;
};
type Testimonial = {
  id: number;
  guestName: string;
  guestOrigin: string;
  quote: string;
  rating: number;
  isPublished: boolean;
};
type PopupImage = {
  id: number;
  title: string;
  imageUrl: string;
  buttonLabel: string;
  buttonUrl: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyLanding: LandingPayload = {
  siteName: "",
  heroTagline: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImageUrl: "",
  ctaPrimary: "",
  ctaSecondary: "",
  aboutTitle: "",
  aboutBody: "",
  contactPhone: "",
  contactEmail: "",
};

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [landing, setLanding] = useState<LandingPayload>(emptyLanding);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [popupImages, setPopupImages] = useState<PopupImage[]>([]);

  async function checkSession() {
    const res = await fetch("/api/admin/session");
    const json = await res.json();
    setAuth(Boolean(json.authenticated));
  }

  async function fetchAll() {
    const [landingRes, facilitiesRes, attractionsRes, testimonialsRes, popupImagesRes] = await Promise.all([
      fetch("/api/admin/landing"),
      fetch("/api/admin/facilities"),
      fetch("/api/admin/attractions"),
      fetch("/api/admin/testimonials"),
      fetch("/api/admin/popup-images"),
    ]);

    if ([landingRes, facilitiesRes, attractionsRes, testimonialsRes, popupImagesRes].some((r) => r.status === 401)) {
      setAuth(false);
      return;
    }

    setLanding((await landingRes.json()).data);
    setFacilities((await facilitiesRes.json()).data);
    setAttractions((await attractionsRes.json()).data);
    setTestimonials((await testimonialsRes.json()).data);
    setPopupImages((await popupImagesRes.json()).data);
  }

  useEffect(() => {
    (async () => {
      await checkSession();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!auth) return;
    fetchAll();
  }, [auth]);

  async function login(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    if (!res.ok) {
      setError("Login gagal. Cek username/password.");
      return;
    }
    setAuth(true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth(false);
  }

  async function saveLanding() {
    await fetch("/api/admin/landing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(landing),
    });
    await fetchAll();
  }

  async function createFacility() {
    await fetch("/api/admin/facilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Fasilitas Baru", description: "Deskripsi", sortOrder: facilities.length + 1, isPublished: true }),
    });
    await fetchAll();
  }

  async function createAttraction() {
    await fetch("/api/admin/attractions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Destinasi Baru",
        location: "Lokasi",
        description: "Deskripsi",
        imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=80",
        priceFrom: 150000,
        sortOrder: attractions.length + 1,
        isPublished: true,
      }),
    });
    await fetchAll();
  }

  async function createTestimonial() {
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: "Guest Baru",
        guestOrigin: "Kota",
        quote: "Pengalaman sangat menyenangkan.",
        rating: 5,
        isPublished: true,
      }),
    });
    await fetchAll();
  }

  async function createPopupImage() {
    await fetch("/api/admin/popup-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Promo Baru",
        imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&q=80",
        buttonLabel: "Lihat Sekarang",
        buttonUrl: "#kontak",
        sortOrder: popupImages.length + 1,
        isActive: true,
      }),
    });
    await fetchAll();
  }

  async function patchItem(kind: string, id: number, body: unknown) {
    await fetch(`/api/admin/${kind}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await fetchAll();
  }

  async function deleteItem(kind: string, id: number) {
    await fetch(`/api/admin/${kind}/${id}`, { method: "DELETE" });
    await fetchAll();
  }

  if (loading) return <div className="p-10">Memuat...</div>;

  if (!auth) {
    return (
      <div className="mx-auto max-w-md px-6 py-12">
        <Link href="/" className="text-sm text-river">
          Kembali ke landing
        </Link>
        <Card className="mt-4 p-6">
          <h1 className="text-2xl font-bold">Login Admin</h1>
          <form className="mt-4 space-y-3" onSubmit={login}>
            <Input placeholder="Username" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} />
            <Input
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button className="w-full" type="submit">
              Masuk
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Content Manager</h1>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </header>

      <Card className="p-5">
        <h2 className="text-xl font-semibold">Konten Landing</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input value={landing.siteName} onChange={(e) => setLanding({ ...landing, siteName: e.target.value })} placeholder="Nama brand" />
          <Input value={landing.heroTagline} onChange={(e) => setLanding({ ...landing, heroTagline: e.target.value })} placeholder="Tagline" />
          <Input value={landing.heroTitle} onChange={(e) => setLanding({ ...landing, heroTitle: e.target.value })} placeholder="Judul hero" />
          <Input value={landing.heroImageUrl} onChange={(e) => setLanding({ ...landing, heroImageUrl: e.target.value })} placeholder="URL hero image" />
          <Input value={landing.ctaPrimary} onChange={(e) => setLanding({ ...landing, ctaPrimary: e.target.value })} placeholder="CTA utama" />
          <Input value={landing.ctaSecondary} onChange={(e) => setLanding({ ...landing, ctaSecondary: e.target.value })} placeholder="CTA kedua" />
          <Input value={landing.aboutTitle} onChange={(e) => setLanding({ ...landing, aboutTitle: e.target.value })} placeholder="Judul about" />
          <Input value={landing.contactPhone} onChange={(e) => setLanding({ ...landing, contactPhone: e.target.value })} placeholder="No phone" />
          <Input value={landing.contactEmail} onChange={(e) => setLanding({ ...landing, contactEmail: e.target.value })} placeholder="Email" />
        </div>
        <Textarea className="mt-3" value={landing.heroSubtitle} onChange={(e) => setLanding({ ...landing, heroSubtitle: e.target.value })} placeholder="Subjudul hero" />
        <Textarea className="mt-3" value={landing.aboutBody} onChange={(e) => setLanding({ ...landing, aboutBody: e.target.value })} placeholder="Body about" />
        <Button className="mt-3" onClick={saveLanding}>
          Simpan Konten Landing
        </Button>
      </Card>

      <CrudList
        title="Fasilitas"
        createLabel="Tambah Fasilitas"
        onCreate={createFacility}
        items={facilities}
        renderItem={(item) => (
          <div className="grid gap-2 md:grid-cols-4">
            <Input defaultValue={item.title} onBlur={(e) => patchItem("facilities", item.id, { ...item, title: e.target.value })} />
            <Input defaultValue={item.description} onBlur={(e) => patchItem("facilities", item.id, { ...item, description: e.target.value })} />
            <Input
              type="number"
              defaultValue={item.sortOrder}
              onBlur={(e) => patchItem("facilities", item.id, { ...item, sortOrder: Number(e.target.value) })}
            />
            <div className="flex items-center gap-2">
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={item.isPublished}
                  onChange={(e) => patchItem("facilities", item.id, { ...item, isPublished: e.target.checked })}
                />{" "}
                Publish
              </label>
              <Button size="sm" variant="destructive" onClick={() => deleteItem("facilities", item.id)}>
                Hapus
              </Button>
            </div>
          </div>
        )}
      />

      <CrudList
        title="Destinasi"
        createLabel="Tambah Destinasi"
        onCreate={createAttraction}
        items={attractions}
        renderItem={(item) => (
          <div className="grid gap-2 md:grid-cols-4">
            <Input defaultValue={item.title} onBlur={(e) => patchItem("attractions", item.id, { ...item, title: e.target.value })} />
            <Input defaultValue={item.location} onBlur={(e) => patchItem("attractions", item.id, { ...item, location: e.target.value })} />
            <Input defaultValue={item.imageUrl} onBlur={(e) => patchItem("attractions", item.id, { ...item, imageUrl: e.target.value })} />
            <Input
              type="number"
              defaultValue={item.priceFrom ?? 0}
              onBlur={(e) => patchItem("attractions", item.id, { ...item, priceFrom: Number(e.target.value) })}
            />
            <Textarea className="md:col-span-3" defaultValue={item.description} onBlur={(e) => patchItem("attractions", item.id, { ...item, description: e.target.value })} />
            <div className="flex items-center gap-2">
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={item.isPublished}
                  onChange={(e) => patchItem("attractions", item.id, { ...item, isPublished: e.target.checked })}
                />{" "}
                Publish
              </label>
              <Button size="sm" variant="destructive" onClick={() => deleteItem("attractions", item.id)}>
                Hapus
              </Button>
            </div>
          </div>
        )}
      />

      <CrudList
        title="Testimoni"
        createLabel="Tambah Testimoni"
        onCreate={createTestimonial}
        items={testimonials}
        renderItem={(item) => (
          <div className="grid gap-2 md:grid-cols-4">
            <Input defaultValue={item.guestName} onBlur={(e) => patchItem("testimonials", item.id, { ...item, guestName: e.target.value })} />
            <Input defaultValue={item.guestOrigin} onBlur={(e) => patchItem("testimonials", item.id, { ...item, guestOrigin: e.target.value })} />
            <Input type="number" min={1} max={5} defaultValue={item.rating} onBlur={(e) => patchItem("testimonials", item.id, { ...item, rating: Number(e.target.value) })} />
            <div className="flex items-center gap-2">
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={item.isPublished}
                  onChange={(e) => patchItem("testimonials", item.id, { ...item, isPublished: e.target.checked })}
                />{" "}
                Publish
              </label>
              <Button size="sm" variant="destructive" onClick={() => deleteItem("testimonials", item.id)}>
                Hapus
              </Button>
            </div>
            <Textarea className="md:col-span-4" defaultValue={item.quote} onBlur={(e) => patchItem("testimonials", item.id, { ...item, quote: e.target.value })} />
          </div>
        )}
      />

      <CrudList
        title="Popup Gambar Awal"
        createLabel="Tambah Popup"
        onCreate={createPopupImage}
        items={popupImages}
        renderItem={(item) => (
          <div className="grid gap-2 md:grid-cols-4">
            <Input defaultValue={item.title} onBlur={(e) => patchItem("popup-images", item.id, { ...item, title: e.target.value })} />
            <Input defaultValue={item.imageUrl} onBlur={(e) => patchItem("popup-images", item.id, { ...item, imageUrl: e.target.value })} />
            <Input defaultValue={item.buttonLabel} onBlur={(e) => patchItem("popup-images", item.id, { ...item, buttonLabel: e.target.value })} />
            <Input defaultValue={item.buttonUrl} onBlur={(e) => patchItem("popup-images", item.id, { ...item, buttonUrl: e.target.value })} />
            <div className="flex items-center gap-2">
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => patchItem("popup-images", item.id, { ...item, isActive: e.target.checked })}
                />{" "}
                Aktif
              </label>
              <Button size="sm" variant="destructive" onClick={() => deleteItem("popup-images", item.id)}>
                Hapus
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

function CrudList<T extends { id: number }>({
  title,
  createLabel,
  onCreate,
  items,
  renderItem,
}: {
  title: string;
  createLabel: string;
  onCreate: () => Promise<void>;
  items: T[];
  renderItem: (item: T) => ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button size="sm" onClick={onCreate}>
          {createLabel}
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 p-3">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </Card>
  );
}
