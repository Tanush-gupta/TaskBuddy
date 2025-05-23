import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONDGODB_URL}
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
