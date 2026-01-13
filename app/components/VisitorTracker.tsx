"use client";

import { useEffect } from "react";

export default function VisitorTracker() {
  useEffect(() => {
    fetch("/api/visit", { method: "POST" });
  }, []);

  return null;
}
