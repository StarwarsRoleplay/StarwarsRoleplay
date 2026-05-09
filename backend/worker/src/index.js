import { verifyTOTP, signSession, verifySession } from './utils/totp.js';
import { renderDocs } from './utils/docs.js';

const GROUP_ID = '866453521';
const RANKS_OF_INTEREST = [
    'Ownership',
    'SWRP : Project Lead',
    'Manager',
    'Team Management',
    'Administrator',
    'Head Game Moderator',
    'Game Moderator',
    'Test Game Moderator',
    'Developer'
];

function getCookie(request, name) {
  const cookieString = request.headers.get('Cookie');
  if (!cookieString) return null;
  const cookies = cookieString.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
}

function docsGateHTML(error) {
  const errorBanner = error
    ? `<p style="color:#ef4444;font-family:monospace;font-size:11px;letter-spacing:.05em;margin-bottom:16px;text-align:center">${error}</p>`
    : '';
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>API DOCS // SWRP</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#08080a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'JetBrains Mono',monospace}
    .wrap{background:#111114;border:1px solid #252529;padding:40px 36px;width:300px}
    .eyebrow{font-size:9px;color:#71717a;letter-spacing:.15em;margin-bottom:10px}
    .title{font-size:16px;color:#fff;font-weight:700;letter-spacing:.08em;margin-bottom:6px}
    .sub{font-size:10px;color:#52525b;letter-spacing:.05em;margin-bottom:28px}
    input{width:100%;background:#08080a;border:1px solid #252529;color:#fff;font-family:inherit;font-size:22px;letter-spacing:.35em;padding:11px 14px;text-align:center;outline:none;margin-bottom:14px;transition:border-color .15s}
    input:focus{border-color:#8b1919}
    input::placeholder{color:#3f3f46;letter-spacing:.2em;font-size:16px}
    button{width:100%;background:rgba(139,25,25,.08);border:1px solid rgba(139,25,25,.35);color:#8b1919;font-family:inherit;font-size:10px;letter-spacing:.12em;padding:11px;cursor:pointer;transition:all .15s}
    button:hover{background:#8b1919;color:#fff}
  </style>
</head>
<body>
  <div class="wrap">
    <p class="eyebrow">SWRP · WEBSITE</p>
    <p class="title">API REFERENZ</p>
    <p class="sub">ZUGANG GESICHERT</p>
    ${errorBanner}
    <form method="POST" action="/api/docs">
      <input type="text" name="code" maxlength="6" placeholder="000000"
             autocomplete="one-time-code" inputmode="numeric" autofocus pattern="\\d{6}">
      <button type="submit">AUTHENTIFIZIEREN</button>
    </form>
  </div>
</body>
</html>`;
  return new Response(html, {
    status:  error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // ── Docs Routes ──────────────────────────────────────────────────────────
    if (url.pathname === '/api/docs') {
      if (request.method === 'GET') {
        const cookie = getCookie(request, 'swrp_docs_session');
        if (cookie && env.DOCS_TOTP_SECRET) {
          const expires = await verifySession(env.DOCS_TOTP_SECRET, cookie);
          if (expires) return renderDocs(env);
        }
        return docsGateHTML();
      }
      
      if (request.method === 'POST') {
        const body = await request.text().catch(() => '');
        const code = new URLSearchParams(body).get('code') ?? '';
        if (!env.DOCS_TOTP_SECRET) return docsGateHTML('Server-Konfigurationsfehler.');
        const valid = await verifyTOTP(env.DOCS_TOTP_SECRET, code);
        if (!valid) return docsGateHTML('Falscher Code – bitte erneut versuchen.');
        
        const sessionVal = await signSession(env.DOCS_TOTP_SECRET, 300); // 5 min
        const docsResp = renderDocs(env);
        const headers = new Headers(docsResp.headers);
        headers.set('Set-Cookie', `swrp_docs_session=${sessionVal}; HttpOnly; Secure; SameSite=Strict; Path=/api/docs; Max-Age=300`);
        return new Response(docsResp.body, { status: 200, headers });
      }
    }

    // Handle both root and /api/v1/staff
    if (url.pathname !== '/api/v1/staff' && url.pathname !== '/') {
      return new Response('Not Found', { status: 404 });
    }

    const cacheUrl = new URL(request.url);
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    let response = await cache.match(cacheKey);

    if (!response) {
      console.log('Cache miss. Fetching from Roblox.');
      try {
        const staffData = await fetchStaffFromRoblox();
        
        response = new Response(JSON.stringify(staffData), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Enable CORS
            'Cache-Control': 'public, max-age=120', // Cache for 2 minutes
          },
        });

        // Store in cache
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch staff data', message: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } else {
      console.log('Cache hit.');
      // Ensure CORS header is present even on cache hit
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      response = new Response(response.body, { ...response, headers: newHeaders });
    }

    return response;
  },
};

async function fetchStaffFromRoblox() {
    // Fetch roles
    const rolesResponse = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}/roles`, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });
    const rolesData = await rolesResponse.json();
    
    if (!rolesData.roles) {
        throw new Error('Failed to get roles from Roblox API');
    }

    const roles = rolesData.roles.filter(role => RANKS_OF_INTEREST.includes(role.name));
    
    const staffByRank = {};
    
    for (const role of roles) {
        // Fetch users for this role
        const usersResponse = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}/roles/${role.id}/users`, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        const usersData = await usersResponse.json();
        
        if (usersData.data) {
            staffByRank[role.name] = usersData.data.map(user => ({
                id: user.userId,
                name: user.username,
                displayName: user.displayName
            }));
        } else {
            staffByRank[role.name] = [];
        }
    }
    
    // Ensure all requested ranks are present in the output, even if empty
    RANKS_OF_INTEREST.forEach(rank => {
        if (!staffByRank[rank]) {
            staffByRank[rank] = [];
        }
    });

    return staffByRank;
}
