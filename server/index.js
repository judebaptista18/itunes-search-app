import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import axios from "axios";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// iTunes Search Proxy
app.get("/api/search", async (req, res) => {
  const { term, offset = "0", limit = "10" } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  const offsetNum = parseInt(String(offset), 10);
  const limitNum = parseInt(String(limit), 10);

  try {
    const { data: parsed } = await axios.get(
      "https://itunes.apple.com/search",
      {
        params: {
          term: String(term),
          limit: 100,
          entity: "allTrack,album,musicArtist",
        },
      },
    );

    return res.json({
      resultCount: parsed.resultCount,
      totalResults: parsed.results.length,
      results: parsed.results.slice(offsetNum, offsetNum + limitNum),
    });
  } catch (err) {
    const message = err.response
      ? "Failed to parse iTunes response"
      : "Failed to reach iTunes API";
    const status = err.response ? 500 : 502;

    console.error("iTunes API error:", err.message);
    return res.status(status).json({ error: message });
  }
});

// production - Vite outputs to /dist
if (process.env.NODE_ENV === "production") {
  const distPath = join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });
  app.use((_req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Proxy: /api/search -> itunes.apple.com`);
  if (process.env.NODE_ENV === "production") {
    console.log(`Serving build from /dist`);
  }
});
