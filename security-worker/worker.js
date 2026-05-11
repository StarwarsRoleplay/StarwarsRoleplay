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
// Sources identified by static analysis of the repo (2026-05-11):
//   Scripts : self only — Vite production build outputs hashed external .js files,
//             no inline scripts in dist/index.html
//   Styles  : self + unsafe-inline — React components use inline style props
//             (e.g. style={{ clipPath: '...' }}) which require unsafe-inline
//   Fonts   : self — no Google Fonts or external font CDN in use
//   Images  : self, data: — local assets only; avatars are proxied through the
//             swrp.thatzane.workers.dev API worker
//   Connect : self (swrp.me), swrp.thatzane.workers.dev (API calls from React),
//             apis.roblox.com (Roblox OAuth), www.roblox.com (profile/group links)
//
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
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
