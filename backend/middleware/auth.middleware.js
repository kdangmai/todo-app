const jwt = require('jsonwebtoken');
const db = require('../models');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.userId = decoded.user_id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.isManager = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.userId, { include: db.Role });
    if (!user || !user.Role) return res.status(403).json({ message: 'Forbidden' });

    if (user.Role.role_name !== 'Manager') {
      return res.status(403).json({ message: 'Manager role required' });
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.isEmployee = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.userId, { include: db.Role });
    if (!user || !user.Role) return res.status(403).json({ message: 'Forbidden' });

    if (user.Role.role_name !== 'Employee') {
      return res.status(403).json({ message: 'Employee role required' });
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};


