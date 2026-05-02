const express = require("express");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const app = express();
const PORT = process.env.PORT || 10000;

// IMPORTANT: your Bluemap root
const ROOT = path.join(__dirname, "maps");

// Enable JSON parsing
app.use(express.json());

// =======================
// MIME TYPES
// =======================
function mime(file) {
  if (file.endsWith(".html")) return "text/html";
  if (file.endsWith(".css")) return "text/css";
  if (file.endsWith(".js")) return "application/javascript";
  if (file.endsWith(".json")) return "application/json";
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".jpg")) return "image/jpeg";
  if (file.endsWith(".svg")) return "image/svg+xml";
  if (file.endsWith(".prbm")) return "application/octet-stream";
  return "application/octet-stream";
}

// =======================
// RECEIVE PLAYER DATA
// =======================
app.post("/players", (req, res) => {
  try {
    const players = req.body;

    if (!Array.isArray(players)) {
      return res.status(400).send("Invalid data");
    }

    const formatted = {
      players: players.map(p => ({
        uuid: String(p.uuid || ""),
        name: String(p.name || ""),
        foreign: false,
        position: {
          x: Number(p.x || 0),
          y: Number(p.y || 0),
          z: Number(p.z || 0)
        },
        rotation: {
          pitch: Number(p.pitch || 0),
          yaw: Number(p.yaw || 0),
          roll: 0
        }
      }))
    };

    // ✅ FIXED: includes /live/ subdirectory
    const outPath = path.join(ROOT, "maps", "world", "live", "players.json");

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(formatted, null, 4));

    console.log("✔ players.json updated at maps/maps/world/live/");

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Server error");
  }
});

// =======================
// STATIC SERVER (GZ SUPPORT)
// =======================
app.get("*", (req, res) => {
  let reqPath = decodeURIComponent(req.path);
  if (reqPath === "/") reqPath = "/index.html";

  const normal = path.join(ROOT, reqPath);
  const gz = normal + ".gz";

  if (fs.existsSync(normal) && fs.statSync(normal).isFile()) {
    res.type(mime(normal));
    return fs.createReadStream(normal).pipe(res);
  }

  if (fs.existsSync(gz) && fs.statSync(gz).isFile()) {
    res.type(mime(normal));
    return fs
      .createReadStream(gz)
      .pipe(zlib.createGunzip())
      .pipe(res);
  }

  res.status(404).send("Not found");
});

// =======================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});