import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api";

const ADMIN_COOKIE_NAME = "portfolio_admin_token";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${BACKEND_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok || !data?.data) {
      const res = NextResponse.json({ authenticated: false }, { status: 401 });
      res.cookies.set(ADMIN_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: data.data,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[AdminAuth Proxy] Session check error:", err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
