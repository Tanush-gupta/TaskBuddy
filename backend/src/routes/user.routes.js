import express from "express";
import {
  login,
  register,
  getUser,
  logout,
} from "../controller/User.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUser", getUser);
router.get("/logout", logout);

export default router;
