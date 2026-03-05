import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionToken, isValidAdminCredential } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const username = String(body?.username ?? "");
  const password = String(body?.password ?? "");

  if (!isValidAdminCredential(username, password)) {
    return NextResponse.json({ message: "Username atau password salah" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, getAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 10,
  });

  return NextResponse.json({ ok: true });
}
