import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import dotenv from "dotenv";
import { createAdminUser } from "./src/utils/createadmin.js";
dotenv.config();

const PORT = 5050;

connectDB()
  .then(async () => {
    app.listen(PORT || 8000, () => {
      console.log("Server is running at:", PORT || 8000);
    });
    await createAdminUser();
  })
  .catch((error) => {
    console.log("Failed Connecting to Server !!! :", error);
  });
