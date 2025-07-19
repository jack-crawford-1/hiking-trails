import express from "express";
import cors from "cors";
import router from "./routes/routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", router);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  res.status(500).send("Server error");
});

export default app;
