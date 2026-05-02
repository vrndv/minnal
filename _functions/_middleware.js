export const onRequest = async ({ request, next }) => {
  const response = await next();

  const url = new URL(request.url);

  // ONLY target BlueMap tiles
  if (url.pathname.includes("/maps/") && url.pathname.includes("/tiles/")) {
    const newHeaders = new Headers(response.headers);

    // Force no transformation by edge
    newHeaders.set("cache-control", "public, max-age=0, no-transform");

    // CRITICAL: ensure gzip is not mangled
    newHeaders.delete("content-encoding");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  }

  return response;
};
