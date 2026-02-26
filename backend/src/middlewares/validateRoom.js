const { body } = require("express-validator");

const addRoomValidation = [
  body("roomNo")
    .notEmpty().withMessage("Room number is required")
    .isString().withMessage("Room number must be a string")
    .trim()
    .isLength({ min: 1, max: 20 }).withMessage("Room number must be 1-20 characters"),
  body("capacity")
    .notEmpty().withMessage("Capacity is required")
    .isInt({ min: 1, max: 20 }).withMessage("Capacity must be an integer between 1 and 20"),
  body("hasAC")
    .notEmpty().withMessage("AC availability is required")
    .isBoolean().withMessage("hasAC must be true or false"),
  body("hasAttachedWashroom")
    .notEmpty().withMessage("Attached washroom availability is required")
    .isBoolean().withMessage("hasAttachedWashroom must be true or false"),
];

const updateRoomValidation = [
  body("roomNo").optional().isString().trim().isLength({ min: 1, max: 20 }),
  body("capacity").optional().isInt({ min: 1, max: 20 }).withMessage("Capacity must be 1-20"),
  body("hasAC").optional().isBoolean().withMessage("hasAC must be true or false"),
  body("hasAttachedWashroom").optional().isBoolean().withMessage("hasAttachedWashroom must be true or false"),
];

const allocateRoomValidation = [
  body("students")
    .notEmpty().withMessage("Number of students is required")
    .isInt({ min: 1 }).withMessage("Students must be a positive integer"),
  body("needsAC")
    .notEmpty().withMessage("AC requirement must be specified")
    .isBoolean().withMessage("needsAC must be true or false"),
  body("needsWashroom")
    .notEmpty().withMessage("Washroom requirement must be specified")
    .isBoolean().withMessage("needsWashroom must be true or false"),
  body("groupName").optional().isString().trim().isLength({ max: 100 }),
];

module.exports = { addRoomValidation, updateRoomValidation, allocateRoomValidation };
