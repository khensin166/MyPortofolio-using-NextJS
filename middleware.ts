import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const response = intlMiddleware(req);

  // GSC Workaround: If next-intl redirects the root path '/' to '/en' with a 307 Temporary Redirect,
  // we force it to be a 308 Permanent Redirect so Google Search Console accepts the "Change of Address".
  if (response.status === 307 && req.nextUrl.pathname === "/") {
    const newResponse = new NextResponse(response.body, response);
    newResponse.status = 308;
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
