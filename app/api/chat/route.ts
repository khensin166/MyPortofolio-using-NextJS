// DEPRECATED: Chat API has been moved to the Hono backend.
export async function GET() {
  return new Response("Chat is now handled by the Hono backend.", { status: 410 });
}
export async function POST() {
  return new Response("Chat is now handled by the Hono backend.", { status: 410 });
}