// Controller for handling faction data requests

const DEFAULT_FACTIONS = [
    { id: 'rg', name: "Red Guards", members: 17, type: "Elite Guard", code: "AX-01" },
    { id: '41st', name: "41st Elite Corps", members: 13, type: "Infantry", code: "INF-41" },
    { id: 'rc', name: "Rep. Commandos", members: 22, type: "Special Forces", code: "SPEC-RC" },
    { id: 'arc', name: "Advanced Recon", members: 12, type: "Reconnaissance", code: "RCN-A" },
    { id: '401st', name: "Coruscant Guards", members: 12, type: "Security", code: "SEC-401" },
    { id: 'cadet', name: "Cadet Academy", members: 3, type: "Training", code: "TRN-00" },
    { id: 'senate', name: "Galactic Senate", members: 3, type: "Government", code: "GOV-01" },
    { id: '91st', name: "91st Mobile Recon", members: 6, type: "Reconnaissance", code: "RCN-91" },
    { id: 'riia', name: "Rep. Intelligence", members: 9, type: "Intelligence", code: "INT-R" },
    { id: 'sg', name: "Senate Guards", members: 5, type: "Elite Guard", code: "AX-02" },
    { id: '212th', name: "212th Attack Bat.", members: 19, type: "Assault", code: "AST-212" },
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
