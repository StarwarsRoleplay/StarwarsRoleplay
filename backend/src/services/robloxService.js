const GROUP_ID = '866453521';
const RANKS_OF_INTEREST = [
    'Developer',
    'Test Game Moderator',
    'Game Moderator',
    'Head Game Moderator',
    'Administrator',
    'Team Management',
    'Manager',
    'SWRP : Project Lead',
    'Ownership'
];

let cache = {
    data: null,
    timestamp: 0
};

const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

async function getStaffMembers() {
    const now = Date.now();
    if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
        console.log('Returning cached staff data');
        return cache.data;
    }

    try {
        console.log('Fetching staff data from Roblox API');
        // Fetch roles
        const rolesResponse = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}/roles`);
        const rolesData = await rolesResponse.json();
        
        if (!rolesData.roles) {
            throw new Error('Failed to get roles from Roblox API');
        }

        const roles = rolesData.roles.filter(role => RANKS_OF_INTEREST.includes(role.name));
        
        const staffByRank = {};
        
        for (const role of roles) {
            // Fetch users for this role
            const usersResponse = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}/roles/${role.id}/users`);
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

        cache.data = staffByRank;
        cache.timestamp = now;
        
        return staffByRank;
    } catch (error) {
        console.error('Error fetching staff from Roblox:', error);
        // If fetch fails but we have cached data, return it even if expired
        if (cache.data) {
            console.log('Returning expired cache due to fetch error');
            return cache.data;
        }
        throw error;
    }
}

module.exports = {
    getStaffMembers
};
