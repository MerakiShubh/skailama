import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import User from '../models/user.model.js';
import Event from '../models/event.models.js';
import EventUpdateHistory from '../models/eventUpdateHistory.model.js';

const createEvent = asyncHandler(async (req, res) => {
  const { users, timezone, startDate, startTime, endDate, endTime } = req.body;

  if (!users || !timezone || !startDate || !startTime || !endDate || !endTime) {
    throw new ApiError(400, 'All fields are required');
  }

  const event = await Event.create({
    users,
    timezone,
    startDate,
    startTime,
    endDate,
    endTime,
  });

  await Promise.all(users.map((userId) => User.findByIdAndUpdate(userId, { $push: { events: event._id } })));

  return res.status(201).json(new ApiResponse(201, event, 'Event created successfully'));
});

const getAllEvents = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, 'User ID is required');
  }

  const user = await User.findById(userId).populate({
    path: 'events',
    select: 'timezone startDate startTime endDate endTime users createdAt updatedAt',
    populate: {
      path: 'users',
      select: 'name',
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const events = (user.events || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.status(200).json(new ApiResponse(200, events, 'Events fetched successfully'));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { eventId, updates, clientUpdatedAt } = req.body;

  if (!eventId || !updates) {
    throw new ApiError(400, 'Event ID and updates are required');
  }

  const oldEvent = await Event.findById(eventId);
  if (!oldEvent) {
    throw new ApiError(404, 'Event not found');
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
    new: true,
  }).populate('users', 'name');

  let messageParts = [];

  if (
    updates.users &&
    JSON.stringify(updates.users.sort()) !== JSON.stringify(oldEvent.users.map((id) => id.toString()).sort())
  ) {
    const newUserIds = updates.users.map((id) => id.toString());
    const oldUserIds = oldEvent.users.map((id) => id.toString());

    const usersToAdd = newUserIds.filter((id) => !oldUserIds.includes(id));
    const usersToRemove = oldUserIds.filter((id) => !newUserIds.includes(id));

    if (usersToAdd.length > 0) {
      await User.updateMany({ _id: { $in: usersToAdd } }, { $addToSet: { events: eventId } });
    }

    if (usersToRemove.length > 0) {
      await User.updateMany({ _id: { $in: usersToRemove } }, { $pull: { events: eventId } });
    }

    const remainingUsers = await User.find({
      _id: { $in: newUserIds },
    }).select('name');

    const userNames = remainingUsers.map((u) => u.name).join(', ');
    messageParts.push(`Participants updated: now includes ${userNames}`);
  }

  const fieldChanges = [];

  if (updates.startDate && updates.startDate !== oldEvent.startDate) fieldChanges.push('startDate');
  if (updates.startTime && updates.startTime !== oldEvent.startTime) fieldChanges.push('startTime');
  if (updates.endDate && updates.endDate !== oldEvent.endDate) fieldChanges.push('endDate');
  if (updates.endTime && updates.endTime !== oldEvent.endTime) fieldChanges.push('endTime');

  if (fieldChanges.length > 0) {
    messageParts.push(`${fieldChanges.join(', ')} updated`);
  }

  const message = messageParts.join(' | ');

  if (message) {
    await EventUpdateHistory.create({
      event: eventId,
      message,
      updatedAt: clientUpdatedAt || new Date(),
    });
  }

  const remainingUsers = updatedEvent.users.map((u) => u.name);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        updatedEvent,
        remainingUsers,
        changes: {
          changedFields: fieldChanges,
          updatedAt: clientUpdatedAt || new Date(),
        },
        message,
      },
      'Event updated successfully'
    )
  );
});

const getEventLogs = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    throw new ApiError(400, 'Event ID is required');
  }

  const logs = await EventUpdateHistory.find({ event: eventId }).sort({ updatedAt: -1 }).lean();

  if (!logs.length) {
    throw new ApiError(404, 'No update logs found for this event');
  }

  return res.status(200).json(new ApiResponse(200, logs, 'Event update logs fetched successfully'));
});

export { createEvent, getAllEvents, updateEvent, getEventLogs };
