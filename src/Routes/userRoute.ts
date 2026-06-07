import { Router } from "express";
import {
  simpanUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../Controllers/Usercontroller.js";

const router = Router();

router.post("/simpan-user", simpanUser);
router.post("/login", loginUser);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;