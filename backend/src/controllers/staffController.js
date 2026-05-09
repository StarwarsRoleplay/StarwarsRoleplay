const robloxService = require('../services/robloxService');

exports.getStaff = async (req, res) => {
  try {
    const staff = await robloxService.getStaffMembers();
    res.json(staff);
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff data' });
  }
};
