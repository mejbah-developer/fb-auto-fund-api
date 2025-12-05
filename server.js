import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Example list of API keys with usage limits
const keys = {
  "demo-key-123": { usage_remaining: 10, expires_at: "2025-12-31" },
  "premium-key-456": { usage_remaining: 50, expires_at: "2026-12-31" }
};

// Endpoint to validate key
app.post("/validate_key", (req, res) => {
  const { api_key } = req.body;
  if (!api_key || !keys[api_key]) {
    return res.json({ valid: false });
  }
  const keyData = keys[api_key];
  const now = new Date();
  if (new Date(keyData.expires_at) < now || keyData.usage_remaining <= 0) {
    return res.json({ valid: false });
  }

  // Decrease usage remaining
  keyData.usage_remaining -= 1;

  res.json({
    valid: true,
    expires_at: keyData.expires_at,
    usage_remaining: keyData.usage_remaining
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
