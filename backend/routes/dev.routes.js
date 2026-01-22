const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/seed-roles', async (req, res) => {
  try {
    const roles = ['Quản lý', 'Nhân viên'];
    for (const r of roles) {
      await db.Role.findOrCreate({ where: { role_name: r } });
    }
    const all = await db.Role.findAll({ order: [['role_id', 'ASC']] });
    return res.json({ message: 'Seed roles ok', roles: all });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
