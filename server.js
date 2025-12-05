const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let apiKeys = [
  { key: "12345", expires: "2025-12-31", usageLimit: 100, used: 0 },
  { key: "ABCDE", expires: "2025-12-31", usageLimit: 50, used: 0 }
];

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Validate API key
app.post("/validate_key", (req, res) => {
  const { api_key } = req.body;
  const keyObj = apiKeys.find(k => k.key === api_key);
  if (!keyObj) return res.json({ valid: false, message: "Invalid key" });

  const now = new Date();
  if (new Date(keyObj.expires) < now) return res.json({ valid: false, message: "Key expired" });

  if (keyObj.used >= keyObj.usageLimit) return res.json({ valid: false, message: "Usage limit reached" });

  keyObj.used++;
  return res.json({ valid: true, message: "Key valid", remaining: keyObj.usageLimit - keyObj.used });
});

// Admin panel to list keys
app.get("/admin/keys", (req, res) => {
  res.json(apiKeys);
});

// Add new key (for admin only, simple version)
app.post("/admin/add_key", (req, res) => {
  const { key, expires, usageLimit } = req.body;
  apiKeys.push({ key, expires, usageLimit, used: 0 });
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
