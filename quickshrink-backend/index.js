import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { customAlphabet } from "nanoid";
import QRCode from "qrcode";

const app = express();
app.use(cors({
  origin: true, // Allow all origins in development
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
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
    return { ok: false, error: "URL is required" };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return { ok: false, error: "URL is required" };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid URL. Include https:// or http://" };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, error: "Only HTTP and HTTPS URLs are supported" };
  }

  return { ok: true, value: parsed.toString() };
};

// API to shorten URL (with QR generation and DB storage)
app.post("/api/shorten", async (req, res) => {
  try {
    const { url, alias } = req.body;

    const result = validateUrl(url);
    if (!result.ok) {
      return res.status(400).json({ message: result.error });
    }

    const normalizedUrl = result.value;
    const trimmedAlias = typeof alias === "string" ? alias.trim() : "";
    const shortCode = trimmedAlias !== "" ? trimmedAlias : nanoid();

    const [existing] = await pool.query(
      "SELECT id FROM links WHERE short_code = ?",
      [shortCode]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Alias already taken!" });
    }

    // Create the final short URL
    const shortUrl = `http://localhost:${PORT}/${shortCode}`;

    // Persist the original URL so redirects work
    try {
      await pool.query(
        "INSERT INTO links (short_code, original_url, qr_code) VALUES (?, ?, NULL)",
        [shortCode, normalizedUrl]
      );
    } catch (dbErr) {
      // If constraint error, try to alter table and retry
      if (dbErr.code === 'ER_BAD_NULL_ERROR' || dbErr.message?.includes('NOT NULL')) {
        console.log("Attempting to update schema to allow NULL for original_url...");
        try {
          await pool.execute("ALTER TABLE links MODIFY original_url TEXT NULL");
          // Retry the insert
          await pool.query(
            "INSERT INTO links (short_code, original_url, qr_code) VALUES (?, ?, NULL)",
            [shortCode, normalizedUrl]
          );
        } catch (alterErr) {
          console.error("Schema update error:", alterErr);
          throw dbErr; // Throw original error
        }
      } else {
        throw dbErr;
      }
    }

    return res.json({
      shortCode,
      shortUrl
    });
  } catch (err) {
    console.error("Shorten error:", err);
    console.error("Shorten error message:", err.message);
    console.error("Shorten error code:", err.code);
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Dedicated API to generate QR code for any URL (short or long)
app.post("/api/qr", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const result = validateUrl(url);
    if (!result.ok) {
      return res.status(400).json({ message: result.error });
    }

    const normalizedUrl = result.value;

    // Generate SVG string
    const svg = await QRCode.toString(normalizedUrl, { type: "svg" });

    // Save only the QR code, all other fields set to NULL
    // Try to update schema first if needed (graceful handling)
    try {
      const [insertResult] = await pool.execute(
        "INSERT INTO links (qr_code, original_url, short_code) VALUES (?, NULL, NULL)",
        [svg]
      );
      res.json({ id: insertResult.insertId, qrSvg: svg });
    } catch (dbErr) {
      // If constraint error, try to alter table and retry
      if (
        dbErr.code === 'ER_BAD_NULL_ERROR' ||
        dbErr.message?.includes('NOT NULL')
      ) {
        console.log("Attempting to update schema to allow NULL for original_url and short_code...");
        try {
          await pool.execute("ALTER TABLE links MODIFY original_url TEXT NULL");
          await pool.execute("ALTER TABLE links MODIFY short_code VARCHAR(100) NULL");
          // Retry the insert
          const [insertResult] = await pool.execute(
            "INSERT INTO links (qr_code, original_url, short_code) VALUES (?, NULL, NULL)",
            [svg]
          );
          res.json({ id: insertResult.insertId, qrSvg: svg });
        } catch (alterErr) {
          console.error("Schema update error:", alterErr);
          throw dbErr; // Throw original error
        }
      } else {
        throw dbErr;
      }
    }
  } catch (err) {
    console.error("QR error:", err);
    console.error("QR error message:", err.message);
    console.error("QR error code:", err.code);
    res.status(500).json({ 
      message: "Unable to generate QR code",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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

  if (!url) {
    return res.status(404).send("Short URL not found");
  }

  await pool.query(
    "UPDATE links SET clicks = clicks + 1, last_visited = NOW() WHERE short_code = ?",
    [code]
  );

  res.redirect(url);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
