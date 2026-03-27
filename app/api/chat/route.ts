import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/messages` 
      : `http://localhost:3000/api/messages`;
      
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${process.env.API_SECRET_KEY || 'supersecretkey'}` // Fallback generic
      }
    });

    if (!res.ok) throw new Error("Failed to fetch messages");
    
    const json = await res.json();
    return NextResponse.json(json.data || json, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const url = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/messages` 
      : `http://localhost:3000/api/messages`;
      
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Failed to insert message");

    return NextResponse.json("Data saved successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};