import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api";

export const ADMIN_COOKIE_NAME = "portfolio_admin_token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const clientIp =
      req.headers.get("x-vercel-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for") ||
      "";

    const backendRes = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(clientIp ? { "x-forwarded-for": clientIp } : {}),
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok || !data?.data?.token) {
      return NextResponse.json(
        { error: data?.error || data?.message || "Invalid email or password" },
        { status: backendRes.status || 401 },
      );
    }

    const res = NextResponse.json(
      {
        success: true,
        data: {
          user: data.data.user,
        },
      },
      { status: 200 },
    );

    res.cookies.set(ADMIN_COOKIE_NAME, data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return res;
  } catch (err) {
    console.error("[AdminAuth Proxy] Login error:", err);
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 },
    );
  }
}
