const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Task = require('./Task');
const TaskConfirmation = require('./TaskConfirmation');

// 1 User có 1 Role
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// 1 User (Quản lý) tạo ra nhiều Task
User.hasMany(Task, { foreignKey: 'creator_id' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'creator_id' });

// Mối quan hệ nhiều-nhiều giữa User (Nhân viên) và Task (xác nhận)
User.belongsToMany(Task, { through: TaskConfirmation, foreignKey: 'user_id' });
Task.belongsToMany(User, { through: TaskConfirmation, foreignKey: 'task_id' });

TaskConfirmation.belongsTo(User, { foreignKey: 'user_id' });
TaskConfirmation.belongsTo(Task, { foreignKey: 'task_id' });

const db = { sequelize, Role, User, Task, TaskConfirmation };

module.exports = db;