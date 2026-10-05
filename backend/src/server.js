import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "KiSara.id API is running successfully"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "KiSara backend is healthy"
  });
});

app.listen(PORT, () => {
  console.log(`KiSara API running at http://localhost:${PORT}`);
});