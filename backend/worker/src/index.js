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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
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
