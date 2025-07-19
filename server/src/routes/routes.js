import express from "express";

import {
  addUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
  countUsers,
} from "../controllers/userControllers.js";

import {
  getAllTracks,
  getAllTrackAlerts,
  getTrackAlertById,
  getTrackDetailsById,
  getAllTracksInRegion,
  getAllHuts,
  getAllHutAlerts,
  getHutDetailsByID,
  getHutAlertById,
} from "../controllers/docControllers.js";

const router = express.Router();

// users
router.get("/users", getUsers);
router.post("/users", addUser);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/count", countUsers);

// tracks
router.get("/tracks", getAllTracks);
router.get("/tracks/:id", getTrackDetailsById);
router.get("/tracks/region/:id", getAllTracksInRegion);
router.get("/tracks/alerts", getAllTrackAlerts);
router.get("/tracks/:id/alerts", getTrackAlertById);

// huts
router.get("/huts", getAllHuts);
router.get("/huts/:id", getHutDetailsByID);
router.get("/huts/alerts", getAllHutAlerts);
router.get("/huts/:id/alerts", getHutAlertById);

export default router;
