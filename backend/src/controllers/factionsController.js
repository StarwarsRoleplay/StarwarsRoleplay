// Controller for handling faction data requests

const DEFAULT_FACTIONS = [
    { id: 'rg', name: "Red Guards", members: 17, type: "Elite Guard", code: "AX-01", groupId: '734074037', description: "The elite protectors of the Supreme Chancellor and the Senate. Clad in distinctive red armor, they are the most loyal and lethal guards in the Republic.", gamepassLink: null },
    { id: '41st', name: "41st Elite Corps", members: 13, type: "Infantry", code: "INF-41", groupId: '353784713', description: "Specialized in long-range operations and planetary scouting. Known for their camouflage armor and expertise in harsh environments like Kashyyyk.", gamepassLink: null },
    { id: 'rc', name: "Rep. Commandos", members: 22, type: "Special Forces", code: "SPEC-RC", groupId: '1085075157', description: "Elite special forces units operating in four-man squads. They handle the most dangerous covert operations, sabotage, and assassination missions.", gamepassLink: null },
    { id: 'arc', name: "Advanced Recon", members: 12, type: "Reconnaissance", code: "RCN-A", groupId: '848398756', description: "Highly independent ARC Troopers trained for complex reconnaissance and unconventional warfare. They operate with high autonomy.", gamepassLink: null },
    { id: '401st', name: "Coruscant Guards", members: 12, type: "Security", code: "SEC-401", groupId: '445428424', description: "The military police and security force for the capital planet. They maintain order, protect government installations, and handle prisoner transport.", gamepassLink: "https://www.roblox.com/game-pass/1747600338/[TEAM]-Coruscant-Guard" },
    { id: 'cadet', name: "Cadet Academy", members: 3, type: "Training", code: "TRN-00", groupId: '880407964', description: "The training ground for the next generation of clones. Cadets undergo rigorous combat and tactical training before deployment.", gamepassLink: null },
    { id: 'senate', name: "Galactic Senate", members: 3, type: "Government", code: "GOV-01", groupId: '1109103792', description: "The political heart of the Republic. Senators and representatives debate policy, while security forces ensure their safety.", gamepassLink: null },
    { id: '91st', name: "91st Mobile Recon", members: 6, type: "Reconnaissance", code: "RCN-91", groupId: '139410049', description: "A highly mobile reconnaissance unit specialized in speeder bike operations and rapid deployment behind enemy lines.", gamepassLink: null },
    { id: 'riia', name: "Rep. Intelligence", members: 9, type: "Intelligence", code: "INT-R", groupId: '645269431', description: "The covert branch handling espionage, code-breaking, and counter-intelligence to protect Republic secrets.", gamepassLink: null },
    { id: 'sg', name: "Senate Guards", members: 5, type: "Elite Guard", code: "AX-02", groupId: '602172556', description: "The traditional security force of the Senate Plaza. They wear blue robes and carry non-lethal weapons for crowd control.", gamepassLink: null },
    { id: '212th', name: "212th Attack Bat.", members: 19, type: "Assault", code: "AST-212", groupId: '354790445', description: "An elite assault unit known for siege operations and heavy combat. Led by Commander Cody and General Kenobi.", gamepassLink: "https://www.roblox.com/game-pass/1747544350/[TEAM]-212th-Attack-Battalion" },
];

exports.getFactions = async (req, res) => {
  try {
    // TODO: Integrate with Roblox API service to get live counts
    // For now, return the default data
    res.json(DEFAULT_FACTIONS);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch factions data' });
  }
};
