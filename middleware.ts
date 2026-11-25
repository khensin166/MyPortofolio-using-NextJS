import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // Jika domain adalah kenantomfie.site, lakukan redirect 301 langsung ke kenantomfie.com
  // Ini diperlukan agar Google Search Console mendeteksi "Pengalihan 301" yang valid
  if (host.includes("kenantomfie.site")) {
    const newUrl = new URL(req.nextUrl.pathname, "https://kenantomfie.com");
    newUrl.search = req.nextUrl.search;
    return NextResponse.redirect(newUrl, 301);
  }

  // Proteksi server-side rute Admin (/(en|id)/admin/* kecuali /admin/login)
  const pathname = req.nextUrl.pathname;
  const adminMatch = pathname.match(/^\/(en|id)\/admin(?:\/(.*))?$/);
  if (adminMatch) {
    const locale = adminMatch[1];
    const subPath = adminMatch[2] || "";
    const isLoginPage = subPath === "login" || subPath.startsWith("login/");
    const adminToken = req.cookies.get("portfolio_admin_token")?.value;

    if (!isLoginPage && !adminToken) {
      const loginUrl = new URL(`/${locale}/admin/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = intlMiddleware(req);

  // GSC Workaround: If next-intl redirects the root path '/' to '/en' with a 307 Temporary Redirect,
  // we force it to be a 308 Permanent Redirect so Google Search Console accepts the "Change of Address".
  if (response.status === 307 && req.nextUrl.pathname === "/") {
    const newResponse = new NextResponse(response.body, {
      status: 308,
      headers: response.headers,
    });
    return newResponse;
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/ingest`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/", "/(id|en)/:path*", "/((?!api|ingest|_next|_vercel|.*\\..*).*)"],
};
