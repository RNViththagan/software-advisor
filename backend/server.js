require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Function to convert price to LKR
const convertPriceToLKR = (price) => {
    const exchangeRate = 325; // USD to LKR conversion rate
    const match = price.match(/\$([\d.]+)/); // Extract USD price
    return match ? `LKR ${Math.round(parseFloat(match[1]) * exchangeRate)}` : price;
};

// Route: Get software recommendations
app.post("/recommendations", async (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).json({ error: "Task description is required." });

    const prompt = `
    Provide a structured JSON output for software recommendations based on the following task description:
    '${task}'
    
    Each software should have:
    - name (string)
    - official_website (string, must be an official website or 'N/A')
    - price_range (string, e.g., 'Free', '$50/month', 'Freemium', or 'N/A')
    - platforms (list of strings, e.g., ['Windows', 'macOS', 'Linux'])
    - key_features (list of strings, e.g., ['Video Editing', 'Color Correction'])
    - best_for (list of strings, e.g., ['Content Creators', 'Professional Editing'])
    - alternatives (list of strings, e.g., ['Adobe Premiere Pro', 'Final Cut Pro'])

    Convert price to LKR where applicable.
    Ensure missing values are filled with 'N/A'.
    Output only valid JSON, no extra text.
    `;

    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            {
                contents: [{ parts: [{ text: prompt }] }],
            },
            { params: { key: process.env.GEMINI_API_KEY } }
        );

        // Extract JSON from AI response
        const match = response.data?.candidates?.[0]?.content?.parts?.[0]?.text.match(/\[.*\]/s);
        const jsonData = match ? JSON.parse(match[0]) : null;

        if (!jsonData) return res.status(500).json({ error: "Invalid JSON response from AI" });

        // Convert prices and validate website links
        const processedData = jsonData.map((software) => ({
            ...software,
            official_website: software.official_website?.startsWith("http") ? software.official_website : "N/A",
        }));

        res.json(processedData);
    } catch (error) {
        console.error("Error fetching AI response:", error);
        res.status(500).json({ error: "Failed to get recommendations" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
