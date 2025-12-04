import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { customAlphabet } from "nanoid";
import QRCode from "qrcode";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Generate 8-character short code
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 8);

// MySQL Connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root", // your mysql password
  database: "quickshrink",
});

console.log("Connected to MySQL");

// API to shorten URL
app.post("/api/shorten", async (req, res) => {
  try {
    const { url, alias } = req.body;

    if (!url) return res.status(400).json({ message: "URL is required" });

    const shortCode = alias?.trim() !== "" ? alias : nanoid();

    const [existing] = await pool.query(
      "SELECT id FROM links WHERE short_code = ?",
      [shortCode]
    );

    if (existing.length > 0)
      return res.status(400).json({ message: "Alias already taken!" });

    await pool.query(
      "INSERT INTO links (original_url, short_code) VALUES (?, ?)",
      [url, shortCode]
    );

    const shortUrl = `http://localhost:${PORT}/${shortCode}`;

    const qrCodeSvg = await QRCode.toString(shortUrl, { type: "svg" });

    return res.json({
      shortCode,
      shortUrl,
      qrCodeSvg,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Redirect short link
app.get("/:code", async (req, res) => {
  const code = req.params.code;

  const [rows] = await pool.query(
    "SELECT original_url FROM links WHERE short_code = ?",
    [code]
  );

  if (rows.length === 0) return res.status(404).send("Short URL not found");

  const url = rows[0].original_url;

  await pool.query(
    "UPDATE links SET clicks = clicks + 1, last_visited = NOW() WHERE short_code = ?",
    [code]
  );

  res.redirect(url);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
