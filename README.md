# Pinsi Glamping Landing + Admin CMS (Next.js 16)

Stack:
- Next.js 16 + React 19 + TypeScript
- PostgreSQL + Prisma
- Tailwind CSS + UI component style shadcn

Fitur:
- Landing page modern untuk wisata glamping tepi sungai.
- Popup awal saat website dibuka (multi gambar, bisa dikelola admin).
- Admin login.
- Admin dapat mengubah seluruh konten utama: hero, fasilitas, destinasi, testimoni, popup.

## Setup Lokal

1. Salin env:
```bash
copy .env.example .env
```

2. Install dependency:
```bash
npm install
```

3. Push schema ke PostgreSQL:
```bash
npm run db:push
```

4. Seed data awal:
```bash
npm run db:seed
```

5. Jalankan app:
```bash
npm run dev
```

Route:
- Landing page: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

Default admin:
- Username: `admin`
- Password: `admin123`

## Full Docker

```bash
docker compose up --build -d
docker compose logs -f app
```

Seed data (opsional, sekali):

```bash
docker compose exec app npm run db:seed
```

Stop:

```bash
docker compose down
```

## Deploy

- App: Vercel
- Database: Neon atau Supabase Postgres
- Set env variable di Vercel: `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
