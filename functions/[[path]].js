export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Only handle .prbm requests
  if (!url.pathname.endsWith('.prbm')) {
    return context.next();
  }

  // Rewrite to compressed file
  const gzUrl = new URL(url);
  gzUrl.pathname = gzUrl.pathname + '.gz';

  // Fetch from Pages static assets
  const response = await context.env.ASSETS.fetch(
    new Request(gzUrl, context.request)
  );

  // If not found, return original response (optional fallback)
  if (!response || response.status === 404) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers(response.headers);

  // IMPORTANT: prevent automatic decompression
  headers.delete('Content-Encoding');

  // Set correct binary type
  headers.set('Content-Type', 'application/octet-stream');

  return new Response(response.body, {
    status: response.status,
    headers
  });
}
