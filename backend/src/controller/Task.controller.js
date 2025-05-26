import User from "../models/User.model.js";
import Task from "../models/Task.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { taskValidationSchema } from "./validator.js";
import fs from "fs";

export const createTask = async (req, res) => {
  try {
    const { error } = taskValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, description, status, priority, dueDate } = req.body;
    let assignedTo;

    if (req.user.role === "admin") {
      assignedTo = req.body.assignedTo;
      if (!assignedTo) {
        return res
          .status(400)
          .json({ message: "Assigned user is required for admin" });
      }
    } else {
      assignedTo = req.user._id;
    }

    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const documents = [];

    console.log("Files received:", req.files);
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res
          .status(400)
          .json({ message: "You can upload a maximum of 3 documents." });
      }

      for (const file of req.files) {
        const cloudResult = await uploadOnCloudinary(file.path);
        // fs.unlinkSync(file.path); // remove temp file
        documents.push({
          fileName: file.originalname,
          fileUrl: cloudResult.url,
          uploadDate: new Date(),
        });
      }
    }

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

    const isAdmin = user.role === "admin";
    const isOwner = task.createdBy.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task" });
    }

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
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
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

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudResult = await uploadOnCloudinary(file.path);
        fs.unlinkSync(file.path); // clean up
        task.documents.push({
          fileName: file.originalname,
          fileUrl: cloudResult.url,
          uploadDate: new Date(),
        });
      }
    }

    const savedTask = await task.save();
    const updatedTask = await Task.findById(savedTask._id)
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

    if (user.role !== "admin") {
      query.$or = [{ createdBy: user._id }, { assignedTo: user._id }];
    }

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
