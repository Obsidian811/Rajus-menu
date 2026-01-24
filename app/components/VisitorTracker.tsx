"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    console.log("🚀 VisitorTracker mounted");

    const alreadyTracked = sessionStorage.getItem("menu_visited");
    console.log("alreadyTracked =", alreadyTracked);

    if (alreadyTracked) return;

    sessionStorage.setItem("menu_visited", "true");

    fetch("/api/visit", {
      method: "POST",
    })
      .then(() => console.log("✅ visit API called"))
      .catch((err) => console.error("❌ visit API error", err));
  }, []);

  return null;
}
