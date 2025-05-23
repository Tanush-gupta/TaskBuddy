import express from "express";
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../controller/Task.controller.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(upload.array("taskFile", 3), createTask)
  .get(getAllTasks);
router
  .route("/:taskId")
  .patch(upload.array("taskFile", 3), updateTask)
  .delete(deleteTask);

export default router;
