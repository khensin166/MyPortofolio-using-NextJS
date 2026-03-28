// DEPRECATED: Email API has been moved to the Hono backend.
export async function POST() {
  return new Response("Email is now handled by the Hono backend.", { status: 410 });
}
