export async function onRequest(context) {
  const url = new URL(context.request.url);

  let response = await fetch(context.request);

  // Fix BlueMap .prbm.gz issue
  if (response.status === 404 && url.pathname.endsWith(".prbm")) {
    const gzResponse = await fetch(context.request.url + ".gz");

    if (gzResponse.ok) {
      return new Response(gzResponse.body, {
        headers: {
          "Content-Encoding": "gzip",
          "Content-Type": "application/octet-stream",
        },
      });
    }
  }

  return response;
}
