import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    const { slug } = await params;
    const id = slug;
    
    // Call Hono API to delete message
    const url = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/messages/${id}` 
      : `http://localhost:3000/api/messages/${id}`;
      
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${process.env.API_SECRET_KEY || 'supersecretkey'}`
      }
    });

    return NextResponse.json("Data deleted successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
