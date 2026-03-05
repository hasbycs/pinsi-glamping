import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "glamping_admin_session";

const username = process.env.ADMIN_USERNAME ?? "admin";
const password = process.env.ADMIN_PASSWORD ?? "admin123";
const secret = process.env.ADMIN_SESSION_SECRET ?? "dev-only-secret";

function buildToken() {
  return createHash("sha256")
    .update(`${username}:${password}:${secret}`)
    .digest("hex");
}

export function isValidAdminCredential(inputUsername: string, inputPassword: string) {
  return inputUsername === username && inputPassword === password;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token === buildToken();
}

export function getAdminSessionToken() {
  return buildToken();
}
