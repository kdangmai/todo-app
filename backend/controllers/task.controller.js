const { Op } = require('sequelize');
const db = require('../models');

exports.getAllTasks = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId, { include: db.Role });

    const { q } = req.query;

    const where = {};

    // 1) Phân quyền: Staff chỉ thấy public
    if (user.Role.role_name !== 'Manager') {
      where.visibility = 'public';
    }

    // 2) Tìm kiếm theo q (title/description)
    if (q && q.trim()) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q.trim()}%` } },
        { description: { [Op.like]: `%${q.trim()}%` } },
      ];
    }

    const tasks = await db.Task.findAll({
      where,
      include: [{ model: db.User, as: 'creator', attributes: ['user_id', 'full_name', 'username'] }],
      order: [['task_id', 'DESC']],
    });

    return res.json(tasks);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assigned_date, due_date, priority, visibility } = req.body;

    if (!title) return res.status(400).json({ message: 'title is required' });

    const task = await db.Task.create({
      title,
      description: description || '',
      assigned_date: assigned_date ? new Date(assigned_date) : new Date(),
      due_date: due_date ? new Date(due_date) : null,
      priority: priority || 'Trung bình',
      visibility: visibility === 'private' ? 'private' : 'public',
      creator_id: req.userId
    });

    return res.status(201).json(task);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await db.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, assigned_date, due_date, priority, visibility } = req.body;
    const allowed = {};
    if (title !== undefined) allowed.title = title;
    if (description !== undefined) allowed.description = description;
    if (assigned_date !== undefined) allowed.assigned_date = assigned_date ? new Date(assigned_date) : null;
    if (due_date !== undefined) allowed.due_date = due_date ? new Date(due_date) : null;
    if (priority !== undefined) allowed.priority = priority;
    if (visibility !== undefined) allowed.visibility = visibility === 'private' ? 'private' : 'public';

    await task.update(allowed);
    return res.json(task);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await db.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.destroy();
    return res.json({ message: 'Deleted' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.confirmTask = async (req, res) => {
  try {
    const task = await db.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Chỉ cho phép xác nhận với task public
    if (task.visibility !== 'public') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const [row, created] = await db.TaskConfirmation.findOrCreate({
      where: { task_id: task.task_id, user_id: req.userId },
      defaults: { confirmed_at: new Date() }
    });

    return res.json({
      message: created ? 'Confirmed' : 'Already confirmed',
      confirmed_at: row.confirmed_at
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.getTaskConfirmations = async (req, res) => {
  try {
    const task = await db.Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const confirmations = await db.TaskConfirmation.findAll({
      where: { task_id: task.task_id },
      include: [{ model: db.User, attributes: ['user_id', 'username', 'full_name'] }],
      order: [['confirmed_at', 'DESC']]
    });

    return res.json(confirmations);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
