import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // If user already visited, skip
    if (cookieStore.get("menu_visited")) {
      return NextResponse.json({ skipped: true });
    }

    const webhook = process.env.GOOGLE_SHEET_WEBHOOK;
    if (!webhook) throw new Error("GOOGLE_SHEET_WEBHOOK is missing");

    // Call Apps Script webhook to log visit
    const res = await fetch(webhook, { method: "POST" });

    if (!res.ok) throw new Error("Webhook request failed");

    // Set cookie immediately so duplicate requests won't count
    const response = NextResponse.json({ success: true });
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

// Optional: allow GET just for testing
export async function GET() {
  return NextResponse.json({ message: "Use POST to log visit" });
}
