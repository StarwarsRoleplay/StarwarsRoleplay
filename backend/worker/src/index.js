import { verifyTOTP, signSession, verifySession, hmacHex } from './utils/totp.js';
import { renderDocs } from './utils/docs.js';

async function signUserSession(user, secret, ttlSeconds = 3600) {
    const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
    const payload = JSON.stringify({ user, expires });
    const sig = await hmacHex(secret, payload);
    const encodedPayload = btoa(payload);
    return `${encodedPayload}.${sig}`;
}

async function verifyUserSession(token, secret) {
    const dot = token.indexOf('.');
    if (dot === -1) return null;
    
    const encodedPayload = token.slice(0, dot);
    const givenSig = token.slice(dot + 1);
    
    const payload = atob(encodedPayload);
    const expectedSig = await hmacHex(secret, payload);
    
    if (expectedSig !== givenSig) return null;
    
    const data = JSON.parse(payload);
    if (Math.floor(Date.now() / 1000) > data.expires) return null;
    
    return data.user;
}

function getCorsHeaders(request) {
    const allowedOrigins = ['https://swrp.me', 'http://localhost:5173'];
    const origin = request.headers.get('Origin');
    const headers = new Headers();
    
    if (allowedOrigins.includes(origin)) {
        headers.set('Access-Control-Allow-Origin', origin);
    } else {
        headers.set('Access-Control-Allow-Origin', 'https://swrp.me');
    }
    
    headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return headers;
}

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
    
    // Avatar Proxy Route
    if (url.pathname === '/api/v1/proxy/avatar') {
        const userId = url.searchParams.get('userId');
        const robloxRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=48x48&format=Png&isCircular=true`);
        const data = await robloxRes.json();
        
        const headers = getCorsHeaders(request);
        headers.set('Content-Type', 'application/json');
        return new Response(JSON.stringify(data), { headers });
    }
    
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

    // Routing
    if (url.pathname === '/api/v1/staff' || url.pathname === '/') {
        const cacheUrl = new URL(request.url);
        const cacheKey = new Request(cacheUrl.toString(), request);
        const cache = caches.default;

        let response = await cache.match(cacheKey);

        if (!response) {
          console.log('Cache miss. Fetching from Roblox.');
          try {
            const staffData = await fetchStaffFromRoblox();
            
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            headers.set('Cache-Control', 'public, max-age=120');
            
            response = new Response(JSON.stringify(staffData), { headers });

            // Store in cache
            ctx.waitUntil(cache.put(cacheKey, response.clone()));
          } catch (error) {
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            
            return new Response(JSON.stringify({ error: 'Failed to fetch staff data', message: error.message }), {
              status: 500,
              headers
            });
          }
        } else {
          console.log('Cache hit.');
          // Ensure CORS header is present even on cache hit
          const newHeaders = getCorsHeaders(request);
          // Copy existing headers from cached response except CORS
          for (const [key, value] of response.headers.entries()) {
              if (key.toLowerCase() !== 'access-control-allow-origin') {
                  newHeaders.set(key, value);
              }
          }
          response = new Response(response.body, { ...response, headers: newHeaders });
        }

        return response;
    } 
    
    // Auth Callback
    if (url.pathname === '/api/v1/auth/callback') {
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: getCorsHeaders(request)
            });
        }

        const code = url.searchParams.get('code');
        if (!code) {
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            return new Response(JSON.stringify({ error: 'Code missing' }), { 
                status: 400,
                headers
            });
        }
        
        const clientId = env.ROBLOX_CLIENT_ID;
        const clientSecret = env.ROBLOX_AUTH_SECRET;
        const redirectUri = "https://swrp.me/login"; 
        
        try {
            const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                }),
            });
            
            const tokenData = await tokenResponse.json();
            
            if (tokenData.error) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Token exchange failed', details: tokenData, usedClientId: clientId }), { 
                    status: 400,
                    headers
                });
            }
            
            // Get user info
            const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                },
            });
            
            const userData = await userResponse.json();
            
            // Create session
            const user = {
                id: userData.sub,
                username: userData.preferred_username || userData.name,
                displayName: userData.nickname || userData.name,
            };
            
            // Sign session
            const token = await signUserSession(user, env.ROBLOX_AUTH_SECRET);
            
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            return new Response(JSON.stringify({ user, token }), {
                headers
            });
        } catch (error) {
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            return new Response(JSON.stringify({ error: 'Auth failed', message: error.message }), { 
                status: 500,
                headers
            });
        }
    }

    // Auth User Info
    if (url.pathname === '/api/v1/auth/user') {
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: getCorsHeaders(request)
            });
        }

        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers
            });
        }
        
        const token = authHeader.split(' ')[1];
        const user = await verifyUserSession(token, env.ROBLOX_AUTH_SECRET);
        
        if (!user) {
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { 
                status: 401,
                headers
            });
        }
        
        const headers = getCorsHeaders(request);
        headers.set('Content-Type', 'application/json');
        return new Response(JSON.stringify({ user }), {
            headers
        });
    }

    // Lore Writers List
    if (url.pathname === '/api/v1/lore/writers') {
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: getCorsHeaders(request)
            });
        }

        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers
            });
        }
        
        const token = authHeader.split(' ')[1];
        const user = await verifyUserSession(token, env.ROBLOX_AUTH_SECRET);
        
        if (!user) {
            const headers = getCorsHeaders(request);
            headers.set('Content-Type', 'application/json');
            return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { 
                status: 401,
                headers
            });
        }

        // GET: List writers
        if (request.method === 'GET') {
            try {
                const { results } = await env.DB.prepare("SELECT * FROM lore_writers").all();
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify(results), {
                    headers
                });
            } catch (error) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'DB Error', message: error.message }), { 
                    status: 500,
                    headers
                });
            }
        }

        // POST: Add writer
        if (request.method === 'POST') {
            // Check permissions
            const isAdmin = await isUserAdmin(user.id, env);
            if (!isAdmin) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Forbidden' }), { 
                    status: 403,
                    headers
                });
            }

            const body = await request.json();
            const { username, permissions } = body;

            if (!username) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Username required' }), { 
                    status: 400,
                    headers
                });
            }

            // Lookup user ID by username
            try {
                const userLookup = await fetch('https://users.roblox.com/v1/usernames/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
                });
                const lookupData = await userLookup.json();

                if (!lookupData.data || lookupData.data.length === 0) {
                    const headers = getCorsHeaders(request);
                    headers.set('Content-Type', 'application/json');
                    return new Response(JSON.stringify({ error: 'User not found on Roblox' }), { 
                        status: 400,
                        headers
                    });
                }

                const targetUser = lookupData.data[0];

                // Insert into DB
                await env.DB.prepare(
                    "INSERT INTO lore_writers (roblox_id, username, display_name, permissions, added_by, added_at) VALUES (?, ?, ?, ?, ?, ?)"
                ).bind(
                    String(targetUser.id),
                    targetUser.name,
                    targetUser.displayName,
                    typeof permissions === 'object' ? JSON.stringify(permissions) : (permissions || 'write'),
                    user.username,
                    Math.floor(Date.now() / 1000)
                ).run();

                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ success: true }), {
                    headers
                });
            } catch (error) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Failed to add writer', message: error.message }), { 
                    status: 500,
                    headers
                });
            }
        }

        // DELETE: Remove writer
        if (request.method === 'DELETE') {
            // Check permissions
            const isAdmin = await isUserAdmin(user.id, env);
            if (!isAdmin) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Forbidden' }), { 
                    status: 403,
                    headers
                });
            }

            const urlObj = new URL(request.url);
            const robloxId = urlObj.searchParams.get('id');

            if (!robloxId) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'ID required' }), { 
                    status: 400,
                    headers
                });
            }

            try {
                await env.DB.prepare("DELETE FROM lore_writers WHERE roblox_id = ?").bind(robloxId).run();
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ success: true }), {
                    headers
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'DB Error', message: error.message }), { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }
        }
    }

    // Lore Articles
    if (url.pathname === '/api/v1/lore/articles') {
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: getCorsHeaders(request)
            });
        }

        const authHeader = request.headers.get('Authorization');
        let user = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            user = await verifyUserSession(token, env.ROBLOX_AUTH_SECRET);
        }

        // GET: List or search articles
        if (request.method === 'GET') {
            try {
                const slug = url.searchParams.get('slug');
                const category = url.searchParams.get('category');
                const id = url.searchParams.get('id');
                const showDrafts = url.searchParams.get('show_drafts') === 'true';
                
                let query = "SELECT * FROM lore_articles WHERE 1=1";
                let params = [];
                
                if (id) {
                    query += " AND id = ?";
                    params.push(id);
                } else if (slug) {
                    query += " AND slug = ?";
                    params.push(slug);
                } else if (category) {
                    query += " AND category = ?";
                    params.push(category);
                }
                
                if (!showDrafts) {
                    query += " AND (is_draft IS NULL OR is_draft = 0)";
                } else {
                    // Check if user is authorized to see drafts
                    if (!user) {
                        const headers = getCorsHeaders(request);
                        headers.set('Content-Type', 'application/json');
                        return new Response(JSON.stringify({ error: 'Unauthorized to view drafts' }), { status: 401, headers });
                    }
                    const isAdmin = await isUserAdmin(user.id, env);
                    const permissions = await getUserPermissions(user.id, env);
                    const canWrite = isAdmin || (permissions && permissions.pages && permissions.pages.lore && permissions.pages.lore.includes('write'));
                    if (!canWrite) {
                        const headers = getCorsHeaders(request);
                        headers.set('Content-Type', 'application/json');
                        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
                    }
                }
                
                query += " ORDER BY created_at DESC";
                
                const { results } = await env.DB.prepare(query).bind(...params).all();
                
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                headers.set('Cache-Control', 'public, max-age=60');
                return new Response(JSON.stringify(id ? results[0] : results), { headers });
            } catch (error) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'DB Error', message: error.message }), { status: 500, headers });
            }
        }

        // POST: Create article
        if (request.method === 'POST') {
            if (!user) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
            }

            const isAdmin = await isUserAdmin(user.id, env);
            const permissions = await getUserPermissions(user.id, env);
            const canWrite = isAdmin || (permissions && permissions.pages && permissions.pages.lore && permissions.pages.lore.includes('write'));
            
            if (!canWrite) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const body = await request.json();
            const { title, slug, content, category, is_draft, tags } = body;

            if (!title || !slug || !content || !category) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
            }

            try {
                const result = await env.DB.prepare(
                    "INSERT INTO lore_articles (title, slug, content, category, author_id, author_name, created_at, updated_at, is_draft, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                ).bind(
                    title,
                    slug,
                    content,
                    category,
                    String(user.id),
                    user.username,
                    Math.floor(Date.now() / 1000),
                    Math.floor(Date.now() / 1000),
                    is_draft ? 1 : 0,
                    tags || ''
                ).run();

                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { headers });
            } catch (error) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'DB Error', message: error.message }), { status: 500, headers });
            }
        }

        // PUT: Update article
        if (request.method === 'PUT') {
            if (!user) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
            }

            const isAdmin = await isUserAdmin(user.id, env);
            const permissions = await getUserPermissions(user.id, env);
            const canWrite = isAdmin || (permissions && permissions.pages && permissions.pages.lore && permissions.pages.lore.includes('write'));
            
            if (!canWrite) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const body = await request.json();
            const { id, title, slug, content, category, is_draft, tags } = body;

            if (!id || !title || !slug || !content || !category) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
            }

            try {
                await env.DB.prepare(
                    "UPDATE lore_articles SET title = ?, slug = ?, content = ?, category = ?, updated_at = ?, is_draft = ?, tags = ? WHERE id = ?"
                ).bind(
                    title,
                    slug,
                    content,
                    category,
                    Math.floor(Date.now() / 1000),
                    is_draft ? 1 : 0,
                    tags || '',
                    id
                ).run();

                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ success: true }), { headers });
            } catch (error) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'DB Error', message: error.message }), { status: 500, headers });
            }
        }

        // DELETE: Delete article
        if (request.method === 'DELETE') {
            if (!user) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
            }

            const isAdmin = await isUserAdmin(user.id, env);
            const permissions = await getUserPermissions(user.id, env);
            const canWrite = isAdmin || (permissions && permissions.pages && permissions.pages.lore && permissions.pages.lore.includes('write'));
            
            if (!canWrite) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const id = url.searchParams.get('id');

            if (!id) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'Missing article ID' }), { status: 400, headers });
            }

            try {
                await env.DB.prepare(
                    "DELETE FROM lore_articles WHERE id = ?"
                ).bind(id).run();

                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ success: true }), { headers });
            } catch (error) {
                const headers = getCorsHeaders(request);
                headers.set('Content-Type', 'application/json');
                return new Response(JSON.stringify({ error: 'DB Error', message: error.message }), { status: 500, headers });
            }
        }
    }
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

async function isUserAdmin(userId, env) {
    // Website Maintainer hardcoded
    if (userId === '1445263976') return true;
    
    // Check Roblox rank
    try {
        const response = await fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
        const data = await response.json();
        
        if (data.data) {
            const group = data.data.find(g => g.group.id === parseInt(GROUP_ID));
            if (group) {
                const rankName = group.role.name;
                if (rankName === 'SWRP : Project Lead' || rankName === 'Ownership') {
                    return true;
                }
            }
        }
    } catch (error) {
        console.error('Error checking admin rank:', error);
    }
    
    return false;
}

async function getUserPermissions(userId, env) {
    try {
        const { results } = await env.DB.prepare("SELECT permissions FROM lore_writers WHERE roblox_id = ?").bind(String(userId)).all();
        if (results && results.length > 0) {
            const perms = results[0].permissions;
            if (perms.startsWith('{')) {
                return JSON.parse(perms);
            }
            // Fallback for old simple permissions
            return { pages: { lore: [perms] } };
        }
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
    return null;
}
