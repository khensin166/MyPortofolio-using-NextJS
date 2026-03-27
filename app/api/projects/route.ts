import { NextResponse } from "next/server";
import { getProjects } from "@/services/portfolio";

export const GET = async () => {
  try {
    const data = await getProjects();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Project API Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
};
