"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type PopupImage = {
  id: number;
  title: string;
  imageUrl: string;
  buttonLabel: string;
  buttonUrl: string;
};

type Props = {
  item: PopupImage | null;
};

const STORAGE_KEY = "glamping-popup-dismissed";

export function PopupModal({ item }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!item) return;
    const dismissed = window.sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setOpen(true);
    }
  }, [item]);

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <img src={item.imageUrl} alt={item.title} className="h-72 w-full object-cover" />
        <div className="space-y-3 p-5">
          <p className="text-lg font-semibold text-slate-900">{item.title}</p>
          <div className="flex gap-3">
            <a href={item.buttonUrl} className="inline-flex">
              <Button>{item.buttonLabel}</Button>
            </a>
            <Button
              variant="secondary"
              onClick={() => {
                window.sessionStorage.setItem(STORAGE_KEY, "1");
                setOpen(false);
              }}
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
