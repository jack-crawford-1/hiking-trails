import dotenv from "dotenv";
import { connectDB } from "../db/connection.js";
import { ObjectId } from "mongodb";

dotenv.config();

const uri = process.env.URI;
const dbName = process.env.DB_NAME;
const dbCollection = process.env.DB_COLLECTION;

// HELPER
const getCollection = async () => {
  const db = await connectDB(uri, dbName);
  return db.collection(dbCollection);
};

// COUNT USERS IN COLLECTION

export const countUsers = async (req, res, next) => {
  try {
    const col = await getCollection();
    const count = await col.countDocuments();

    res.json(count);
  } catch (err) {
    next(err);
  }
};

// GET ALL USERS
export const getUsers = async (req, res, next) => {
  try {
    const col = await getCollection();
    const users = await col.find().toArray();

    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET USER BY ID
export const getUserById = async (req, res, next) => {
  try {
    const col = await getCollection();
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Missing user ID in request params." });
    }

    const filter = { _id: ObjectId.createFromHexString(id) };
    const user = await col.findOne(filter);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ADD A USER
export const addUser = async (req, res, next) => {
  try {
    const col = await getCollection();
    const user = req.body;

    if (!user || typeof user !== "object") {
      return res.status(400).json({ error: "Invalid user data." });
    }

    const result = await col.insertOne(user);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    next(err);
  }
};

// UPDATE A USER
export const updateUser = async (req, res, next) => {
  try {
    const col = await getCollection();

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing user ID in URL." });
    }

    const userUpdates = req.body;

    if (!userUpdates || typeof userUpdates !== "object") {
      return res.status(400).json({ error: "Invalid user update data." });
    }

    const filter = { _id: ObjectId.createFromHexString(id) };
    const update = { $set: userUpdates };
    const result = await col.updateOne(filter, update);

    res.status(200).json({
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE A USER
export const deleteUser = async (req, res, next) => {
  try {
    const col = await getCollection();
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing user ID in URL." });
    }

    const filter = { _id: ObjectId.createFromHexString(id) };
    const result = await col.deleteOne(filter);

    res.status(200).json({
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    next(err);
  }
};
