const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
      max: [20, "Capacity cannot exceed 20"],
    },
    hasAC: {
      type: Boolean,
      required: [true, "AC availability must be specified"],
      default: false,
    },
    hasAttachedWashroom: {
      type: Boolean,
      required: [true, "Attached washroom availability must be specified"],
      default: false,
    },
    isAllocated: {
      type: Boolean,
      default: false,
    },
    allocatedTo: {
      type: String,
      default: null,
      trim: true,
    },
    allocatedStudents: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient filtering queries
roomSchema.index({ capacity: 1, hasAC: 1, hasAttachedWashroom: 1, isAllocated: 1 });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
