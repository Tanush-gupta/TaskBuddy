import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import dotenv from "dotenv";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running at:", process.env.PORT || 8000);
    });
  })
  .catch((error) => {
    console.log("Failed Connecting to Server !!! :", error);
  });
