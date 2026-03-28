import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Nodemailer has been removed as per your request. 
    // This route is currently a placeholder.
    console.log("Email notification requested (Nodemailer removed):", body);

    return NextResponse.json({ message: "OK" });
  } catch (error: any) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
