import dotenv from "dotenv";
dotenv.config();
import { connectDB, closeDB } from "./src/db/connection.js";

const env = {
  uri: process.env.URI,
  dbName: process.env.DB_NAME,
  dbCollection: process.env.DB_COLLECTION,
};

async function testMongoConnection() {
  try {
    const db = await connectDB(env.uri);
    console.log("Database name:", db.databaseName);
    console.log("Collection name:", env.dbCollection);

    const users = await db.collection(env.dbCollection).find().toArray();
    console.log("Users in collection:", users);
  } catch (err) {
    console.error("Test connection failed:", err);
  } finally {
    await closeDB();
  }
}

testMongoConnection();
