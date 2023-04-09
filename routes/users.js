const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controller');
const { authenticate, isAdmin } = require('../middleware/authenticate');

router.post('/login', UserController.login);
router.post('/register', UserController.register);

router.use(authenticate); // apply authentication middleware for all following routes

router.get('/', isAdmin, UserController.getAllUsers);
router.get('/:id', isAdmin, UserController.getUserById);
router.post('/', isAdmin, UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', isAdmin, UserController.deleteUser);

module.exports = router;
