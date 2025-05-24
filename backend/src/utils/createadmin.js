import UserModel from "../models/User.model.js";
import bcrypt from "bcryptjs";
export const createAdminUser = async () => {
  try {
    const existingAdmin = await UserModel.findOne({ role: "admin" });
    if (!existingAdmin) {
      const email = "admin@gmail.com";
      const password = "admin@gmail.com";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const adminUser = new UserModel({
        email,
        password: hashedPassword,
        role: "admin",
      });
      await adminUser.save();
      console.log("✅ Admin user created.");
    } else {
      console.log("ℹ️ Admin user already exists.");
    }
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  }
};
