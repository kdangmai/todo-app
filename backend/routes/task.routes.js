const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { verifyToken, isManager } = require('../middleware/auth.middleware');

// Lấy tất cả công việc (logic phân quyền sẽ nằm trong controller)
router.get('/', [verifyToken], taskController.getAllTasks);

// Tạo công việc mới (chỉ Quản lý)
router.post('/', [verifyToken, isManager], taskController.createTask);

// Cập nhật công việc (chỉ Quản lý)
router.put('/:id', [verifyToken, isManager], taskController.updateTask);

// Xóa công việc (chỉ Quản lý)
router.delete('/:id', [verifyToken, isManager], taskController.deleteTask);

// Nhân viên xác nhận đã xem công việc
router.post('/:id/confirm', [verifyToken], taskController.confirmTask);

// Quản lý xem danh sách xác nhận của 1 công việc
router.get('/:id/confirmations', [verifyToken, isManager], taskController.getTaskConfirmations);

module.exports = router;
