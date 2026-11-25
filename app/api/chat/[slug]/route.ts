// DEPRECATED: Legacy unauthenticated delete route removed for security.
export async function DELETE() {
  return new Response("Chat API has been deprecated.", { status: 410 });
}
