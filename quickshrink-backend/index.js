import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { customAlphabet } from "nanoid";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors({
  origin: true, // Allow all origins in development
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const JWT_SECRET = "quickshrink_secret";
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

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

//
app.get("/api/my-links", authMiddleware, async (req, res) => {
  const userId = req.userId;

  const [rows] = await pool.query(
    "SELECT * FROM links WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  res.json(rows);
});

app.get("/api/stats", async (req, res) => {
  try {
    const [[links]] = await pool.query(
      "SELECT COUNT(*) AS totalLinks FROM links"
    );

    const [[users]] = await pool.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [[clicks]] = await pool.query(
      "SELECT IFNULL(SUM(clicks),0) AS totalClicks FROM links"
    );

    res.json({
      totalLinks: links.totalLinks,
      totalUsers: users.totalUsers,
      totalClicks: clicks.totalClicks,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/links", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT short_code, original_url, clicks, created_at 
       FROM links 
       ORDER BY created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// login and signup
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// API to shorten URL (with QR generation and DB storage)
app.post("/api/shorten", authMiddleware, async (req, res) => {
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
        "INSERT INTO links (short_code, original_url, qr_code, user_id) VALUES (?, ?, NULL, ?)",
        [shortCode, normalizedUrl, req.userId]
      );
    } catch (dbErr) {
      // If constraint error, try to alter table and retry
      if (dbErr.code === 'ER_BAD_NULL_ERROR' || dbErr.message?.includes('NOT NULL')) {
        console.log("Attempting to update schema to allow NULL for original_url...");
        try {
          await pool.execute("ALTER TABLE links MODIFY original_url TEXT NULL");
          // Retry the insert
          await pool.query(
            "INSERT INTO links (short_code, original_url, qr_code, user_id) VALUES (?, ?, NULL, ?)",
            [shortCode, normalizedUrl, req.userId]
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
app.post("/api/qr", authMiddleware, async (req, res) => {
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
      //  SAVE QR WITH USER ID (ONLY THIS QUERY)
      const [insertResult] = await pool.execute(
        "INSERT INTO links (original_url, qr_code, short_code, user_id) VALUES (?, ?, NULL, ?)",
        [normalizedUrl, svg, req.userId]
      );

      res.json({
        id: insertResult.insertId,
        qrSvg: svg
      });
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
app.delete("/api/links/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Check link belongs to user
    const [rows] = await pool.query(
      "SELECT id FROM links WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete link
    await pool.query(
      "DELETE FROM links WHERE id = ?",
      [id]
    );

    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/qr/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    "SELECT original_url FROM links WHERE id = ?",
    [id]
  );

  if (rows.length === 0 || !rows[0].original_url) {
    return res.status(404).send("QR not found");
  }

  await pool.query(
    "UPDATE links SET clicks = clicks + 1 WHERE id = ?",
    [id]
  );

  res.redirect(rows[0].original_url);
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});





