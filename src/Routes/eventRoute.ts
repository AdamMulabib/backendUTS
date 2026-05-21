import express from "express";

import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../Controllers/Eventcontroller.js";

const router = express.Router();

// GET ALL
router.get("/", getAllEvents);

// GET BY ID
router.get("/:id", getEventById);

// CREATE
router.post("/", createEvent);

// UPDATE
router.put("/:id", updateEvent);

// DELETE
router.delete("/:id", deleteEvent);

export default router;