import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let secret = searchParams.get("secret");
    let tag = searchParams.get("tag");

    // Try to get from body if not in searchParams
    if (!secret || !tag) {
      try {
        const body = await request.json();
        secret = secret || body.secret;
        tag = tag || body.tag;
      } catch (e) {
        // Body is not JSON or empty, skip
      }
    }

    if (secret !== process.env.NEXT_REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: "Missing tag param" }, { status: 400 });
    }

    revalidateTag(tag, "max");
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
