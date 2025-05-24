import mongoose from "mongoose";
const MONDGODB_URL = "mongodb://mongodb:27017/taskmate";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONDGODB_URL}
      }`
    );
    console.log(
      "Datbase connected || Database Host :",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("MONG~ODB connection error", error);
    process.exit(1);
  }
};
export default connectDB;
