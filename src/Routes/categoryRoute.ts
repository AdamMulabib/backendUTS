import { authenticate } from "../middlewares/authMiddleware.js";
import express from "express";

import { 
    getAllCategories, 
    createCategory, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} from "../Controllers/Categorycontroller.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", authenticate , createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", authenticate , updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;