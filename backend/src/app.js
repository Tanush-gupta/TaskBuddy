import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { upload } from "./middleware/multer.js";

const app = express();

// Configure multer for file uploads

app.get("/", (req, res) => {
  res.send("Hello World from Backend");
});

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Make upload middleware available
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/task", taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export { app };
