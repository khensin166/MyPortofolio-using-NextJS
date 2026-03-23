import { revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    // Mengekstrak rahasia dan tag spesifik yang dikirim oleh Hono API
    const body = await request.json();
    const { secret, tag } = body;

    // Memverifikasi apakah Hono API ini adalah pemilik sahnya
    if (secret !== process.env.NEXT_REVALIDATE_SECRET) {
      return new Response(JSON.stringify({ message: "Akses Ditolak: Secret Tidak Cocok" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!tag) {
      return new Response(JSON.stringify({ message: "Tag spesifik tidak ditemukan di Payload Hono" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // AJAIBNYA TERJADI DI SINI: Menghancurkan Edge Cache Vercel spesifik tersebut!
    revalidateTag(tag, 'max');

    return new Response(JSON.stringify({ 
      revalidated: true, 
      tag_cleared: tag,
      now: Date.now() 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Error dalam Revalidasi", error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
