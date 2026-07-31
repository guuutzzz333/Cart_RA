/**
 * Optional CORS proxy for the RetroAchievements API.
 *
 * Only deploy this if Settings → Save & sync shows the "couldn't reach
 * RetroAchievements directly" message. It does nothing except forward your
 * request to retroachievements.org and add the header that lets a browser
 * read the response. Your username and API key pass through untouched and
 * are never stored or logged by this script.
 *
 * Deploy (free, ~1 minute):
 *   1. https://dash.cloudflare.com → Workers & Pages → Create → Worker.
 *   2. Delete the sample code, paste this file's contents in, Deploy.
 *   3. Copy the workers.dev URL you're given.
 *   4. In the app: Settings → CORS proxy URL → paste it → Save & sync.
 */
const UPSTREAM = "https://retroachievements.org/API/";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    const target = UPSTREAM + url.pathname.replace(/^\/+/, "") + url.search;
    const upstreamRes = await fetch(target, { headers: { Accept: "application/json" } });
    const body = await upstreamRes.text();

    return new Response(body, {
      status: upstreamRes.status,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };
}
