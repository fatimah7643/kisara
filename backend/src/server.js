import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { errorHandler } from "./lib/errors.js";
import catalogRoutes from "./routes/catalog.js";
import readerRoutes from "./routes/reader.js";
import meRoutes from "./routes/me.js";
import walletRoutes from "./routes/wallet.js";
import creatorRoutes from "./routes/creator.js";

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: config.frontendUrls }));
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => res.json({ name: "KiSara.id API", status: "ok" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", simulation: config.allowSimulation }));

app.use("/api", catalogRoutes);
app.use("/api", readerRoutes);
app.use("/api", meRoutes);
app.use("/api", walletRoutes);
app.use("/api/creator", creatorRoutes);

app.use("/api", (req, res) => res.status(404).json({ error: "Endpoint tidak ditemukan." }));
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`KiSara API berjalan di http://localhost:${config.port}`);
});