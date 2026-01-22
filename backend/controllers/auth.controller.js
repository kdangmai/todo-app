const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, password, full_name, role_name } = req.body;

    if (!username || !password || !full_name || !role_name) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const role = await db.Role.findOne({ where: { role_name } });
    if (!role) return res.status(400).json({ message: 'Role not found' });

    const existing = await db.User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      username,
      full_name,
      password_hash,
      role_id: role.role_id
    });

    const createdUser = await db.User.findByPk(user.user_id, { include: db.Role });

    return res.status(201).json({
      message: 'User registered',
      user_id: createdUser.user_id,
      username: createdUser.username,
      full_name: createdUser.full_name,
      role_name: (createdUser.Role.role_name || '').toLowerCase()
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await db.User.findOne({ where: { username }, include: db.Role });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '2h' }
    );

    return res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        role_name: (user.Role?.role_name || '').toLowerCase()
      }
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      include: db.Role,
      attributes: { exclude: ['password_hash'] }
    });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { username, full_name, role_name, password } = req.body;

    const user = await db.User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if updating self or manager
    const currentUser = await db.User.findByPk(req.userId, { include: db.Role });
    if (currentUser.Role.role_name === 'Employee' && user.user_id !== req.userId) {
      return res.status(403).json({ message: 'Can only update own profile' });
    }

    if (username) user.username = username;
    if (full_name) user.full_name = full_name;
    if (password) user.password_hash = await bcrypt.hash(password, 10);
    if (role_name) {
      const role = await db.Role.findOne({ where: { role_name } });
      if (!role) return res.status(400).json({ message: 'Role not found' });
      user.role_id = role.role_id;
    }

    await user.save();
    return res.json({ message: 'User updated' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await db.User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    return res.json({ message: 'User deleted' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
