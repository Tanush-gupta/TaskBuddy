import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import dotenv from "dotenv";
import { createAdminUser } from "./src/utils/createadmin.js";
dotenv.config();

connectDB()
  .then(async () => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running at:", process.env.PORT || 8000);
    });
    await createAdminUser();
  })
  .catch((error) => {
    console.log("Failed Connecting to Server !!! :", error);
  });
