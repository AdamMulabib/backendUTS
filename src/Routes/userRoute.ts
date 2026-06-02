import express from 'express';

import {
    UserController
}

const router = express.Router();
import { UserController } from '../Controllers/Usercontroller.js';
const userController = new UserController();

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;