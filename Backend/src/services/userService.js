import validator from 'validator';
import User from '../models/User.js';
import AppError from '../utils/appError.js';

const buildUserPayload = (body = {}) => {
  const payload = {};

  if (body.name !== undefined) payload.name = body.name;
  if (body.email !== undefined) payload.email = body.email;
  if (body.password !== undefined) payload.password = body.password;

  return payload;
};

const validateName = (name) => {
  if (typeof name !== 'string' || !name.trim()) {
    throw new AppError('Name is required', 400);
  }
};

const validateEmail = (email) => {
  if (typeof email !== 'string' || !email.trim()) {
    throw new AppError('Email is required', 400);
  }

  if (!validator.isEmail(email.trim())) {
    throw new AppError('Please provide a valid email address', 400);
  }
};

const validatePassword = (password) => {
  if (typeof password !== 'string' || !password.trim()) {
    throw new AppError('Password is required', 400);
  }

  if (password.trim().length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }
};

const serializeUser = (user) => (user ? user.toJSON() : null);

export const createUser = async (body) => {
  const payload = buildUserPayload(body);

  validateName(payload.name);
  validateEmail(payload.email);
  validatePassword(payload.password);

  const existingUser = await User.findOne({ email: payload.email.toLowerCase().trim() });
  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const user = await User.create({
    name: payload.name.trim(),
    email: payload.email.toLowerCase().trim(),
    password: payload.password,
  });

  return serializeUser(user);
};

export const getUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map((user) => serializeUser(user));
};

export const getUserById = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return serializeUser(user);
};

export const updateUser = async (id, body) => {
  const payload = buildUserPayload(body);

  if (Object.keys(payload).length === 0) {
    throw new AppError('At least one field is required to update the user', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (payload.name !== undefined) {
    validateName(payload.name);
    user.name = payload.name.trim();
  }

  if (payload.email !== undefined) {
    validateEmail(payload.email);
    const normalizedEmail = payload.email.toLowerCase().trim();
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: id },
    });

    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    user.email = normalizedEmail;
  }

  if (payload.password !== undefined) {
    validatePassword(payload.password);
    user.password = payload.password;
  }

  const updatedUser = await user.save();
  return serializeUser(updatedUser);
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return serializeUser(user);
};
