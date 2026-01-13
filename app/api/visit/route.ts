import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // 👈 await here

  // Prevent recount on refresh
  if (cookieStore.get("menu_visited")) {
    return NextResponse.json({ skipped: true });
  }

  await fetch(process.env.GOOGLE_SHEET_WEBHOOK!, {
    method: "POST",
  });

  cookieStore.set("menu_visited", "true", {
    maxAge: 60 * 60 * 6, // 6 hours
    path: "/",          // good practice
  });

  return NextResponse.json({ success: true });
}
