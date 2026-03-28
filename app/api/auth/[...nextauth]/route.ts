// DEPRECATED: Auth API has been moved to the Hono backend.
export async function GET() {
  return new Response("Auth is now handled by the Hono backend.", { status: 410 });
}
export async function POST() {
  return new Response("Auth is now handled by the Hono backend.", { status: 410 });
}
