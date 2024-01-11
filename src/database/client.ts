import mongoose from "mongoose";

const client = mongoose.connect(
  process.env.MONGODB_URI || "",
  { dbName: process.env.MONGODB_DB_NAME || "" },
).catch((error) => new Error(error));

export default client;
