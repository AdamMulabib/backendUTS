import express from "express";
import { authenticate } from "../Middlewares/authMiddleware.js";

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
router.post("/", authenticate, createEvent);

// UPDATE
router.put("/:id", authenticate, updateEvent);

// DELETE
router.delete("/:id", authenticate, deleteEvent);

export default router;