import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const JWT_SECRET =
  "c8f95a9c5b1b4b9f7a7d5d9d6f9e1e7b4c3a5e2d7a8f4b6d3c1e9f2b5a4c8d7";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }

    return res
      .status(500)
      .json({ message: "Server error during authentication" });
  }
};
