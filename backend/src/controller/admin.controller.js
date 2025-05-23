import User from "../models/User.model.js";
import Task from "../models/Task.model.js";
import bcrypt from "bcryptjs";
import { taskValidationSchema } from "./validator.js";

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const currentUserId = req.user?.id || req.user?._id; // Adjust based on your auth setup

    const users = await User.find({ _id: { $ne: currentUserId } }) // Exclude current user
      .select("-password")
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments({ _id: { $ne: currentUserId } }); // Also exclude in count

    res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (role) user.role = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Task.deleteMany({ assignedTo: user._id });
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Task Management
// export const getAllTasks = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       sort = "createdAt",
//       order = "desc",
//       status,
//       priority,
//     } = req.query;

//     const query = {};
//     if (status) query.status = status;
//     if (priority) query.priority = priority;

//     const tasks = await Task.find(query)
//       .populate("assignedTo", "email")
//       .populate("createdBy", "email")
//       .sort({ [sort]: order === "desc" ? -1 : 1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const count = await Task.countDocuments(query);

//     res.status(200).json({
//       tasks,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       totalTasks: count,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createTask = async (req, res) => {
//   try {
//     const { error } = taskValidationSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const { title, description, status, priority, dueDate, assignedTo } = req.body;

//     // Verify if the assigned user exists
//     const assignedUser = await User.findById(assignedTo);
//     if (!assignedUser) {
//       return res.status(404).json({ message: "Assigned user not found" });
//     }

//     // Handle file uploads
//     const documents = [];
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         documents.push({
//           fileName: file.originalname,
//           fileUrl: `/uploads/${file.filename}`,
//           uploadDate: new Date()
//         });
//       }
//     }

//     const task = await Task.create({
//       title,
//       description,
//       status,
//       priority,
//       dueDate,
//       assignedTo,
//       createdBy: req.user._id,
//       documents
//     });

//     await task.populate("assignedTo", "email");
//     await task.populate("createdBy", "email");

//     res.status(201).json({
//       message: "Task created successfully",
//       task,
//     });
//   } catch (error) {
//     console.error("Error creating task:", error);
//     res.status(500).json({ message: "Failed to create task", error: error.message });
//   }
// };

// export const updateTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     const updates = req.body;
//     Object.keys(updates).forEach((key) => {
//       task[key] = updates[key];
//     });

//     const updatedTask = await task.save();
//     await updatedTask
//       .populate("assignedTo", "username email")
//       .populate("createdBy", "username email")
//       .execPopulate();

//     res.status(200).json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     await task.deleteOne();
//     res.status(200).json({ message: "Task deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
