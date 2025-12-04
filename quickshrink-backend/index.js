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

const validateUrl = (value) => {
  if (!value || typeof value !== "string") {
    return "URL is required";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "URL is required";
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "Invalid URL. Include https:// or http://";
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return "Only HTTP and HTTPS URLs are supported";
  }

  return parsed.toString();
};

// API to shorten URL (no QR generation here)
app.post("/api/shorten", async (req, res) => {
  try {
    const { url, alias } = req.body;

    const validated = validateUrl(url);
    if (validated !== url && !validated.startsWith("http")) {
      return res.status(400).json({ message: validated });
    }

    const normalizedUrl = validated;

    const trimmedAlias = typeof alias === "string" ? alias.trim() : "";
    const shortCode = trimmedAlias !== "" ? trimmedAlias : nanoid();

    const [existing] = await pool.query(
      "SELECT id FROM links WHERE short_code = ?",
      [shortCode]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Alias already taken!" });
    }

    await pool.query(
      "INSERT INTO links (original_url, short_code) VALUES (?, ?)",
      [normalizedUrl, shortCode]
    );

    const shortUrl = `http://localhost:${PORT}/${shortCode}`;

    return res.json({
      shortCode,
      shortUrl,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Dedicated API to generate QR code for any URL (short or long)
app.post("/api/qr", async (req, res) => {
  try {
    const { url } = req.body;

    const validated = validateUrl(url);
    if (validated !== url && !validated.startsWith("http")) {
      return res.status(400).json({ message: validated });
    }

    const normalizedUrl = validated;

    const qrCodeSvg = await QRCode.toString(normalizedUrl, { type: "svg" });

    return res.json({
      qrCodeSvg,
    });
  } catch (err) {
    console.error("QR error:", err);
    res.status(500).json({ message: "Unable to generate QR code" });
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
