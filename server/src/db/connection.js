import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

let client;

async function connectDB(
  uri = process.env.DB_URI,
  dbName = process.env.DB_NAME
) {
  if (client) {
    return client.db(dbName);
  }
  try {
    client = new MongoClient(uri, {
      tls: true,
    });
    await client.connect();

    console.log(`Connected to MongoDB `);
    return client.db(dbName);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    throw err;
  }
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    console.log("MongoDB connection closed");
  }
}

export { connectDB, closeDB };
