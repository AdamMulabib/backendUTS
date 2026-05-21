// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import eventRoutes from "./Routes/eventRoute.js";
import categoryRoutes from "./Routes/categoryRoute.js";
import pembicaraRoutes from "./Routes/pembicaraRoute.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Selamat datang di API Invofest!");
});

app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes);
app.use("/pembicara", pembicaraRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});