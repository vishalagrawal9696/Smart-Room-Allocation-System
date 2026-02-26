const express = require("express");
const router = express.Router();
const {
  addRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  allocateRoom,
  deallocateRoom,
  getRoomStats,
} = require("../controllers/roomController");
const {
  addRoomValidation,
  updateRoomValidation,
  allocateRoomValidation,
} = require("../middlewares/validateRoom");

// Stats — must be before /:id to avoid param conflict
router.get("/stats", getRoomStats);

// Allocation
router.post("/allocate", allocateRoomValidation, allocateRoom);

// CRUD
router.route("/").get(getAllRooms).post(addRoomValidation, addRoom);

router.route("/:id").get(getRoomById).put(updateRoomValidation, updateRoom).delete(deleteRoom);

router.patch("/:id/deallocate", deallocateRoom);

module.exports = router;
