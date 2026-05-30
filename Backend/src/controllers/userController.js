import asyncHandler from '../middleware/asyncHandler.js';
import sendResponse from '../utils/apiResponse.js';
import {
  createUser as createUserService,
  deleteUser as deleteUserService,
  getUserById as getUserByIdService,
  getUsers as getUsersService,
  updateUser as updateUserService,
} from '../services/userService.js';

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserService(req.body);
  return sendResponse(res, 201, 'User created successfully', user);
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await getUsersService();
  return sendResponse(res, 200, 'Users retrieved successfully', users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);
  return sendResponse(res, 200, 'User retrieved successfully', user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserService(req.params.id, req.body);
  return sendResponse(res, 200, 'User updated successfully', user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await deleteUserService(req.params.id);
  return sendResponse(res, 200, 'User deleted successfully', user);
});
