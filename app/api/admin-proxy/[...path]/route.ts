import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api";

const ADMIN_COOKIE_NAME = "portfolio_admin_token";

const REVALIDATABLE_CMS_TAGS = new Set([
  "projects",
  "profile",
  "skills",
  "experiences",
  "articles",
  "certifications",
  "education",
]);

const ALLOWED_TOP_SEGMENTS = new Set([
  "projects",
  "profile",
  "skills",
  "experiences",
  "articles",
  "certifications",
  "education",
  "messages",
  "upload",
  "form-config",
  "inquiry",
  "auth",
]);

async function handleProxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await context.params;
  if (!path || path.length === 0 || !ALLOWED_TOP_SEGMENTS.has(path[0])) {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  // Prevent path traversal segments
  if (path.some((seg) => seg === ".." || seg.includes("/") || seg.includes("\\"))) {
    return NextResponse.json({ error: "Invalid path segment" }, { status: 400 });
  }

  const search = req.nextUrl.search || "";
  const targetUrl = `${BACKEND_API_URL}/${path.map(encodeURIComponent).join("/")}${search}`;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);

  const contentType = req.headers.get("content-type");
  let body: BodyInit | undefined = undefined;

  if (req.method !== "GET" && req.method !== "HEAD") {
    if (contentType?.includes("multipart/form-data")) {
      body = await req.formData();
      // Let fetch set multipart boundary automatically
    } else {
      if (contentType) {
        headers.set("Content-Type", contentType);
      }
      body = await req.arrayBuffer();
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseText = await backendRes.text();

    // Direct on-demand revalidation saat Admin sukses memutasi resource CMS
    // (menjamin update langsung tampil di halaman publik < 1 detik tanpa bergantung webhook antar-lambda)
    if (
      backendRes.ok &&
      req.method !== "GET" &&
      req.method !== "HEAD" &&
      REVALIDATABLE_CMS_TAGS.has(path[0])
    ) {
      try {
        revalidateTag(path[0], { expire: 0 });
        revalidatePath("/", "layout");
      } catch (revalErr) {
        console.error(`[AdminProxy] Revalidate error for "${path[0]}":`, revalErr);
      }
    }

    const res = new NextResponse(responseText, {
      status: backendRes.status,
      headers: {
        "Content-Type":
          backendRes.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });

    if (backendRes.status === 401 || backendRes.status === 403) {
      res.cookies.set(ADMIN_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }

    return res;
  } catch (err) {
    console.error("[AdminProxy] Forwarding error:", err);
    return NextResponse.json(
      { error: "Upstream request failed" },
      { status: 502 },
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
