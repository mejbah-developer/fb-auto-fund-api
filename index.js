import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const keys = {
  "SAMPLEKEY123": { expires_at: "2025-12-31", usage_limit: 100, usage_count: 0 }
};

app.post("/validate_key", (req, res) => {
  const { api_key } = req.body;
  if(!api_key) return res.json({ valid: false, message: "No key provided" });

  const keyData = keys[api_key];
  if(!keyData) return res.json({ valid: false, message: "Invalid key" });

  const now = new Date();
  if(new Date(keyData.expires_at) < now) return res.json({ valid: false, message: "Key expired" });
  if(keyData.usage_count >= keyData.usage_limit) return res.json({ valid: false, message: "Usage limit exceeded" });

  keyData.usage_count += 1;

  res.json({ valid: true, expires_at: keyData.expires_at, usage_remaining: keyData.usage_limit - keyData.usage_count });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
