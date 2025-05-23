import User from "../models/User.model.js";
import Task from "../models/Task.model.js";
import { taskValidationSchema } from "./validator.js";

export const createTask = async (req, res) => {
  try {
    // Validate request body
    const { error } = taskValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Determine who the task is assigned to
    let assignedTo;
    if (req.user.role === "admin") {
      assignedTo = req.body.assignedTo;
      if (!assignedTo) {
        return res
          .status(400)
          .json({ message: "Assigned user is required for admin" });
      }
    } else {
      assignedTo = req.user._id; // normal users can only assign to themselves
    }

    // Verify that assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    // Handle file uploads (max 3 documents)
    const documents = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res
          .status(400)
          .json({ message: "You can upload a maximum of 3 documents." });
      }
      for (const file of req.files) {
        documents.push({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          uploadDate: new Date(),
        });
      }
    }

    // Create the task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      documents,
    });

    await task.populate("assignedTo", "email");
    await task.populate("createdBy", "email");

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user = req.user;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Allow admins to delete any task OR users to delete their own created tasks
    const isAdmin = user.role === "admin";
    const isOwner = task.createdBy.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task" });
    }

    // Remove task reference from assigned user's task array
    await User.findByIdAndUpdate(task.assignedTo, {
      $pull: { tasks: task._id },
    });

    await Task.findByIdAndDelete(taskId);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const user = req.user;
    const isAdmin = user.role === "admin";
    const isOwner = task.createdBy.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      task[key] = updates[key];
    });

    // Optional: handle file updates (append to existing documents)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        task.documents.push({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          uploadDate: new Date(),
        });
      }
    }

    const updatedTask = await task.save();
    await updatedTask
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      status,
      priority,
    } = req.query;

    const user = req.user;
    const query = {};

    // Apply filtering based on role
    if (user.role !== "admin") {
      query.$or = [{ createdBy: user._id }, { assignedTo: user._id }];
    }

    // Apply additional filters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate("assignedTo", "email")
      .populate("createdBy", "email")
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalTasks: count,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: error.message });
  }
};
