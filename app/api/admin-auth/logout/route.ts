import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "portfolio_admin_token";

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
