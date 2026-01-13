import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Skip if already visited
    if (cookieStore.get("menu_visited")) {
      return NextResponse.json({ skipped: true });
    }

    const webhook = process.env.GOOGLE_SHEET_WEBHOOK;
    if (!webhook) throw new Error("GOOGLE_SHEET_WEBHOOK is missing");

    // Use GET instead of POST
    const res = await fetch(webhook);

    if (!res.ok) throw new Error("Webhook request failed");

    const response = NextResponse.json({ success: true });

    // Set a cookie to skip future visits
    response.cookies.set("menu_visited", "true", {
      maxAge: 60 * 60 * 6, // 6 hours
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("VISIT API ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
