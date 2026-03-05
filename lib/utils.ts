import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number | null) {
  if (!value) return "Hubungi untuk harga";
  return `Mulai Rp${new Intl.NumberFormat("id-ID").format(value)}`;
}
