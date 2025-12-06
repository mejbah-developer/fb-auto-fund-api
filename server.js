import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyLU_CJNwiolAtZ-dsB24bUrXuMvdzLYNXQPkNzXrSlA11MsqKRqlLeOaLf20hTMGMCsQ/exec";

// Validate subscription key
app.post("/validate", async (req, res) => {
    const { key, device_id } = req.body;

    if (!key || !device_id) {
        return res.status(400).json({ success: false, message: "Missing key or device_id" });
    }

    try {
        // Call Google Script
        const params = new URLSearchParams({ key, device_id });
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();

        // Example response structure from your Google Script
        // { valid: true, expires: "2025-12-10", device_used: true }

        if (!data.valid) {
            return res.json({ success: false, message: "Invalid subscription key" });
        }

        return res.json({ success: true, message: "Subscription valid", expires: data.expires });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
