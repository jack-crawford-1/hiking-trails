import express from "express";
import { helloHome, helloHello } from "../controllers/helloControllers.js";
import {
  addUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
  countUsers,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", helloHome);
router.get("/hello", helloHello);
router.get("/users", getUsers);
router.post("/users", addUser);
router.get("/user/:id", getUserById);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/count", countUsers);

export default router;
