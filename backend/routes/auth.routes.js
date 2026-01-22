const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/users - Manager only
router.get('/users', authMiddleware.verifyToken, authMiddleware.isManager, authController.getUsers);

// PUT /api/auth/users/:user_id - Manager or self
router.put('/users/:user_id', authMiddleware.verifyToken, authController.updateUser);

// DELETE /api/auth/users/:user_id - Manager only
router.delete('/users/:user_id', authMiddleware.verifyToken, authMiddleware.isManager, authController.deleteUser);

module.exports = router;