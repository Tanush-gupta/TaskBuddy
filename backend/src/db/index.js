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

// import { MongoClient, ServerApiVersion } from "mongodb";

// const URI = "mongodb://mongodb:27017";
// const client = new MongoClient(URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// try {
//   // Connect the client to the server
//   await client.connect();
//   // Send a ping to confirm a successful connection
//   await client.db("admin").command({ ping: 1 });
//   console.log("Pinged your deployment. You successfully connected to MongoDB!");
// } catch (err) {
//   console.error(err);
// }

// let db = client.db("employees");

// export default db;
