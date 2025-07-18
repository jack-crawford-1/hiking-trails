import express from "express";
import { helloHome, helloHello } from "../controllers/helloControllers.js";

const router = express.Router();

router.get("/", helloHome);
router.get("/hello", helloHello);

export default router;
