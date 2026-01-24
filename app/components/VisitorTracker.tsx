"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    // HARD guard: sessionStorage
    const alreadyTracked = sessionStorage.getItem("menu_visited");

    if (alreadyTracked) return;

    sessionStorage.setItem("menu_visited", "true");

    fetch("/api/visit", {
      method: "POST",
      keepalive: true, // important for reliability
    });
  }, []);

  return null; // invisible
}
