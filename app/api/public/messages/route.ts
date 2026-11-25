import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api";

export async function POST(req: NextRequest) {
  const apiKey = process.env.API_SECRET_KEY;
  if (!apiKey) {
    console.error("[PublicMessages Proxy] API_SECRET_KEY is not configured");
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const clientIp =
      req.headers.get("x-vercel-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for") ||
      "";

    const backendRes = await fetch(`${BACKEND_API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Public-API-Key": apiKey,
        ...(clientIp ? { "x-forwarded-for": clientIp } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await backendRes.text();
    return new NextResponse(data, {
      status: backendRes.status,
      headers: {
        "Content-Type":
          backendRes.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error("[PublicMessages Proxy] Error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
