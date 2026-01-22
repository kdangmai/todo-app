const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskConfirmation = sequelize.define('TaskConfirmation', {
  confirmation_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  task_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  confirmed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'task_confirmations',
  timestamps: false,
  indexes: [{ unique: true, fields: ['task_id', 'user_id'] }]
});

module.exports = TaskConfirmation;
