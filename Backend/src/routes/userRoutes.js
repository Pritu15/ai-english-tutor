import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/userController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.route('/').post(createUser).get(getUsers);
router
  .route('/:id')
  .get(validateObjectId, getUserById)
  .put(validateObjectId, updateUser)
  .delete(validateObjectId, deleteUser);

export default router;
