"use client";

import { useEffect } from "react";

/** Registers the PWA service worker once on the client. */
export default function RegisterSW() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* registration is best-effort; ignore failures */
    });
  }, []);

  return null;
}
