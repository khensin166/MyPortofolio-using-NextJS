import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.NEXT_REVALIDATE_SECRET;
    if (!expectedSecret) {
      return NextResponse.json({ message: "Revalidation is not configured" }, { status: 503 });
    }

    const headerSecret = request.headers.get("x-revalidate-secret");
    let tag = request.nextUrl.searchParams.get("tag");

    if (!tag) {
      try {
        const body = await request.json();
        tag = typeof body?.tag === "string" ? body.tag : null;
      } catch {
        // Body is not JSON or empty
      }
    }

    if (!headerSecret || headerSecret !== expectedSecret) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: "Missing tag param" }, { status: 400 });
    }

    revalidateTag(tag, "max");
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
