export async function onRequest(context) {
  const url = new URL(context.request.url);

  // ONLY intercept BlueMap tiles
  if (url.pathname.endsWith(".prbm")) {

    const gz = await fetch(context.request.url + ".gz");

    if (gz.ok) {
      return new Response(gz.body, {
        headers: {
          "Content-Encoding": "gzip",
          "Content-Type": "application/octet-stream",
          "Cache-Control": "public, max-age=31536000"
        }
      });
    }
  }

  return fetch(context.request);
}
