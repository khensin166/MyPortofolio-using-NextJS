import { NextResponse } from "next/server";
import { getPostHogData } from "@/services/posthog";

export const dynamic = 'force-dynamic';

export const GET = async () => {
  try {
    const data = await getPostHogData();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error?.message || "Failed to fetch PostHog data" },
      { status: 500 }
    );
  }
};
