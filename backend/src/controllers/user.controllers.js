import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import User from '../models/user.model.js';
import Event from '../models/event.models.js';

const createUser = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, 'User name is required');
  }

  const user = await User.create({
    name,
    events: [],
  });

  return res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('events', 'timezone startDate startTime endDate endTime');

  return res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).populate('events', 'timezone startDate startTime endDate endTime');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

export { createUser, getAllUsers, getUserById };
