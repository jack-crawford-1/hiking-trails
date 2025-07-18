import express from "express";
import router from "./routes/routes.js";

const app = express();

app.use(express.json());

app.use("/", router);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  res.status(500).send("Server error");
});

export default app;
