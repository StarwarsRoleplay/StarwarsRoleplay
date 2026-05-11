/**
 * SWRP Security Headers – Cloudflare Worker
 *
 * Sits in front of GitHub Pages (starwarsroleplay.github.io) for all
 * traffic at swrp.me. Injects a hardened security header set.
 *
 * Route: swrp.me/*
 * NOTE: API traffic goes directly to swrp.thatzane.workers.dev (separate domain),
 *       so no route specificity conflict exists here.
 */

// ── CSP ──────────────────────────────────────────────────────────────────────
//
// Sources identified by static analysis + live CSP violation reports:
//   Scripts : self + hash for login/index.html inline redirect script.
//             Vite production build outputs hashed external .js files (no inline
//             scripts), but frontend/public/login/index.html contains one inline
//             <script> that reads the OAuth code param and redirects to the hash
//             route. Hash captured from browser CSP violation report.
//   Styles  : self, unsafe-inline (React inline style props e.g. clipPath),
//             fonts.googleapis.com (Inter + JetBrains Mono loaded via @import)
//   Fonts   : self, fonts.gstatic.com (actual font files served by Google)
//   Images  : self, data:, *.rbxcdn.com — avatar headshots are fetched directly
//             from tr.rbxcdn.com (the proxy returns a redirect to the CDN URL,
//             so the browser loads the image from rbxcdn.com directly)
//   Connect : self (swrp.me), swrp.thatzane.workers.dev (API calls from React),
//             apis.roblox.com (Roblox OAuth), www.roblox.com (profile/group links)
//
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // Hash covers the inline redirect script in frontend/public/login/index.html
  "script-src 'self' 'sha256-3C5MTRlga9ZFCZnZZBnplHXNWMnA4MrjRFoYlBBzMnU='",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://tr.rbxcdn.com https://*.rbxcdn.com",
  "connect-src 'self' https://swrp.thatzane.workers.dev https://apis.roblox.com https://www.roblox.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

// ── Security headers injected on every response ───────────────────────────────
const SECURITY_HEADERS = {
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
};

// ── Helper: is this an HTML response? ────────────────────────────────────────
function isHtmlResponse(response) {
  const ct = response.headers.get('Content-Type') || '';
  return ct.includes('text/html');
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    // Subrequests from Cloudflare Workers do NOT re-trigger this worker,
    // so fetch(request) goes directly to the GitHub Pages origin.
    let response;
    try {
      response = await fetch(request);
    } catch (err) {
      return new Response('Bad Gateway', { status: 502 });
    }

    // Clone and mutate headers
    const newHeaders = new Headers(response.headers);

    // 1. Inject all security headers
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      newHeaders.set(name, value);
    }

    // 2. Strip wildcard CORS from HTML page responses only.
    //    Keep CORS on assets (fonts, images) so cross-origin loading works.
    if (isHtmlResponse(response)) {
      newHeaders.delete('Access-Control-Allow-Origin');
      newHeaders.delete('Access-Control-Allow-Methods');
      newHeaders.delete('Access-Control-Allow-Headers');
    }

    // 3. Remove server fingerprinting headers if GitHub Pages adds them
    newHeaders.delete('X-Powered-By');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
