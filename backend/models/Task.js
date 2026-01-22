const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  task_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  assigned_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  due_date: { type: DataTypes.DATE, allowNull: true },
  priority: { type: DataTypes.ENUM('Cao', 'Trung bình', 'Thấp'), defaultValue: 'Trung bình' },
  visibility: { type: DataTypes.ENUM('public', 'private'), defaultValue: 'public' },
  creator_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'tasks',
  timestamps: true,
});

module.exports = Task;
