const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require("../utils/apiResponse");
const { validationResult } = require("express-validator");

/**
 * @desc    Add a new room
 * @route   POST /api/rooms
 * @access  Public
 */
const addRoom = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendBadRequest(res, "Validation failed", errors.array());
  }

  const { roomNo, capacity, hasAC, hasAttachedWashroom } = req.body;

  const existingRoom = await Room.findOne({ roomNo: roomNo.toUpperCase() });
  if (existingRoom) {
    throw new AppError(`Room number ${roomNo.toUpperCase()} already exists`, 409);
  }

  const room = await Room.create({ roomNo, capacity, hasAC, hasAttachedWashroom });

  return sendCreated(res, room, `Room ${room.roomNo} added successfully`);
});

/**
 * @desc    Get all rooms with optional filters
 * @route   GET /api/rooms
 * @access  Public
 */
const getAllRooms = asyncHandler(async (req, res) => {
  const { minCapacity, hasAC, hasAttachedWashroom, isAllocated, page = 1, limit = 50 } = req.query;

  const filter = {};

  if (minCapacity !== undefined) {
    const cap = parseInt(minCapacity, 10);
    if (isNaN(cap) || cap < 1) throw new AppError("minCapacity must be a positive integer", 400);
    filter.capacity = { $gte: cap };
  }

  if (hasAC !== undefined) {
    filter.hasAC = hasAC === "true";
  }

  if (hasAttachedWashroom !== undefined) {
    filter.hasAttachedWashroom = hasAttachedWashroom === "true";
  }

  if (isAllocated !== undefined) {
    filter.isAllocated = isAllocated === "true";
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [rooms, total] = await Promise.all([
    Room.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Room.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    rooms,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get single room by ID
 * @route   GET /api/rooms/:id
 * @access  Public
 */
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) throw new AppError("Room not found", 404);
  return sendSuccess(res, room);
});

/**
 * @desc    Update a room
 * @route   PUT /api/rooms/:id
 * @access  Public
 */
const updateRoom = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendBadRequest(res, "Validation failed", errors.array());
  }

  const room = await Room.findById(req.params.id);
  if (!room) throw new AppError("Room not found", 404);

  if (room.isAllocated) {
    throw new AppError("Cannot update an allocated room. Deallocate it first.", 400);
  }

  const { roomNo, capacity, hasAC, hasAttachedWashroom } = req.body;

  if (roomNo && roomNo.toUpperCase() !== room.roomNo) {
    const conflict = await Room.findOne({ roomNo: roomNo.toUpperCase() });
    if (conflict) throw new AppError(`Room number ${roomNo.toUpperCase()} already exists`, 409);
  }

  const updated = await Room.findByIdAndUpdate(
    req.params.id,
    { roomNo, capacity, hasAC, hasAttachedWashroom },
    { new: true, runValidators: true }
  );

  return sendSuccess(res, updated, "Room updated successfully");
});

/**
 * @desc    Delete a room
 * @route   DELETE /api/rooms/:id
 * @access  Public
 */
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) throw new AppError("Room not found", 404);

  if (room.isAllocated) {
    throw new AppError("Cannot delete an allocated room. Deallocate it first.", 400);
  }

  await Room.findByIdAndDelete(req.params.id);
  return sendSuccess(res, null, `Room ${room.roomNo} deleted successfully`);
});

/**
 * @desc    Allocate the smallest suitable room to students
 * @route   POST /api/rooms/allocate
 * @access  Public
 *
 * Algorithm:
 *  1. Filter rooms that are NOT allocated, meet AC/washroom requirements,
 *     and have capacity >= requested students
 *  2. Sort by capacity ASC to find the smallest fitting room (best-fit)
 *  3. Allocate first result
 */
const allocateRoom = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendBadRequest(res, "Validation failed", errors.array());
  }

  const { students, needsAC, needsWashroom, groupName } = req.body;

  const studentCount = parseInt(students, 10);
  if (isNaN(studentCount) || studentCount < 1) {
    throw new AppError("Number of students must be a positive integer", 400);
  }

  // Build filter — only look at unallocated rooms
  const filter = {
    isAllocated: false,
    capacity: { $gte: studentCount },
  };

  if (needsAC === true || needsAC === "true") filter.hasAC = true;
  if (needsWashroom === true || needsWashroom === "true") filter.hasAttachedWashroom = true;

  // Best-fit: sort by capacity ascending → pick smallest room that fits
  const suitableRoom = await Room.findOne(filter).sort({ capacity: 1 });

  if (!suitableRoom) {
    return sendSuccess(
      res,
      { allocated: false, room: null },
      "No room available matching the specified requirements"
    );
  }

  // Mark room as allocated
  suitableRoom.isAllocated = true;
  suitableRoom.allocatedStudents = studentCount;
  suitableRoom.allocatedTo = groupName || `Group-${Date.now()}`;
  await suitableRoom.save();

  return sendSuccess(
    res,
    { allocated: true, room: suitableRoom },
    `Room ${suitableRoom.roomNo} allocated successfully`
  );
});

/**
 * @desc    Deallocate a room
 * @route   PATCH /api/rooms/:id/deallocate
 * @access  Public
 */
const deallocateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) throw new AppError("Room not found", 404);

  if (!room.isAllocated) {
    throw new AppError("Room is not currently allocated", 400);
  }

  room.isAllocated = false;
  room.allocatedTo = null;
  room.allocatedStudents = 0;
  await room.save();

  return sendSuccess(res, room, `Room ${room.roomNo} deallocated successfully`);
});

/**
 * @desc    Get dashboard stats
 * @route   GET /api/rooms/stats
 * @access  Public
 */
const getRoomStats = asyncHandler(async (req, res) => {
  const [total, allocated, withAC, withWashroom] = await Promise.all([
    Room.countDocuments(),
    Room.countDocuments({ isAllocated: true }),
    Room.countDocuments({ hasAC: true }),
    Room.countDocuments({ hasAttachedWashroom: true }),
  ]);

  return sendSuccess(res, {
    total,
    allocated,
    available: total - allocated,
    withAC,
    withWashroom,
  });
});

module.exports = {
  addRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  allocateRoom,
  deallocateRoom,
  getRoomStats,
};
