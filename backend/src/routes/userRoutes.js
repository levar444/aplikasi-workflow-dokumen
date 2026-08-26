const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, updateStatus, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Izinkan ADMIN, USER1, USER2, USER3, dan USER4 untuk mengakses manajemen user
router.use(authMiddleware, roleMiddleware(['ADMIN', 'USER1', 'USER2', 'USER3', 'USER4']));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteUser);

module.exports = router;