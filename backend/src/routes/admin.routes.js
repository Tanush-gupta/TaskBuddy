import express from "express";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  // getAllTasks,
  // createTask,
  // updateTask,
  // deleteTask,
} from "../controller/admin.controller.js";

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(protect, isAdmin);

// User routes
router.route("/users").get(getAllUsers).post(createUser);
router.route("/users/:id").put(updateUser).delete(deleteUser);

// Task routes
// router
//   .route("/tasks")
//   .get(getAllTasks)
//   .post(upload.array("taskFile", 3), createTask);

// router.route("/tasks/:id").put(updateTask).delete(deleteTask);

export default router;
