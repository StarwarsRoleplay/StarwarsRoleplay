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
    const headers = {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':          'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
    };

    // Fetch roles
    const rolesResponse = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}/roles`, { headers });
    const rolesData = await rolesResponse.json();
    
    if (!rolesData.roles) {
        throw new Error('Failed to get roles from Roblox API');
    }

    const roles = rolesData.roles.filter(role => RANKS_OF_INTEREST.includes(role.name));
    
    const staffByRank = {};
    const allUserIds = [];
    const usersByRole = {};
    
    for (const role of roles) {
        // Fetch users for this role
        const usersResponse = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}/roles/${role.id}/users?sortOrder=Asc&limit=100`, { headers });
        const usersData = await usersResponse.json();
        
        if (usersData.data) {
            usersByRole[role.name] = usersData.data;
            usersData.data.forEach(u => allUserIds.push(u.userId));
        } else {
            usersByRole[role.name] = [];
        }
    }
    
    // Batch fetch thumbnails
    const thumbnailMap = {};
    if (allUserIds.length > 0) {
        try {
            // Deduplicate IDs
            const uniqueIds = [...new Set(allUserIds)];
            const idsStr = uniqueIds.join(',');
            const thumbRes = await fetch(
                `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${idsStr}&size=150x150&format=Png&isCircular=false`,
                { headers }
            );
            if (thumbRes.ok) {
                const thumbData = await thumbRes.json();
                thumbData.data.forEach(t => {
                    if (t.state === 'Completed') {
                        thumbnailMap[t.targetId] = t.imageUrl;
                    }
                });
            }
        } catch (e) {
            console.error('Failed to fetch thumbnails:', e.message);
        }
    }
    
    // Build initial structure
    for (const role of roles) {
        const users = usersByRole[role.name] || [];
        staffByRank[role.name] = users.map(user => ({
            id: user.userId,
            name: user.username,
            displayName: user.displayName,
            avatarUrl: thumbnailMap[user.userId] || null
        }));
    }
    
    // Ensure all requested ranks are present in the output, even if empty
    RANKS_OF_INTEREST.forEach(rank => {
        if (!staffByRank[rank]) {
            staffByRank[rank] = [];
        }
    });

    const targetUserId = 1445263976; // thatzanex
    let targetUser = null;

    // Find the target user in any role to get his data
    for (const rank in staffByRank) {
        const user = staffByRank[rank].find(u => u.id === targetUserId);
        if (user) {
            targetUser = user;
            break;
        }
    }

    // If not found (unlikely), create a fallback
    if (!targetUser) {
        targetUser = {
            id: targetUserId,
            name: "thatzanex",
            displayName: "Zane",
            avatarUrl: thumbnailMap[targetUserId] || null
        };
    }

    // Remove him from all other roles
    for (const rank in staffByRank) {
        staffByRank[rank] = staffByRank[rank].filter(u => u.id !== targetUserId);
    }

    // Create final structure
    const processedStaff = {};
    
    // 1. Website Maintainer
    processedStaff["Website Maintainer"] = [targetUser];
    
    // 2. SWRP : Project Lead (Merge Ownership and Project Lead)
    const ownershipUsers = staffByRank["Ownership"] || [];
    const projectLeadUsers = staffByRank["SWRP : Project Lead"] || [];
    processedStaff["SWRP : Project Lead"] = [...ownershipUsers, ...projectLeadUsers];
    
    // 3. Add the rest
    RANKS_OF_INTEREST.forEach(rank => {
        if (rank !== "Ownership" && rank !== "SWRP : Project Lead") {
            processedStaff[rank] = staffByRank[rank] || [];
        }
    });

    return processedStaff;
}
