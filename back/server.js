import express from "express";
import {GoogleGenAI} from '@google/genai';
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const searchPrompt = `Search the internet for up to 4 places that match the user's description, prioritizing the most popular or well-known locations.

For each place, provide:
- name: the official name of the place
- description: a short, accurate description (2-3 sentences)
- longitude: geographic longitude
- latitude: geographic latitude

Return the response strictly in valid JSON format, with an array called "results" containing up to 4 objects using exactly these variable names: name, description, longitude, latitude, image.

Return ONLY the raw JSON object.

Give the name and description in the same languaje as the user description.

The user's description is: `

app.listen(3000, () => {
  console.log("API listening on port 3000");
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
app.post("/api/search", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "No se recibió prompt" });

        /* await sleep(20000);
        throw new Error(`Error intencional después de ${delay} ms`); */

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: searchPrompt + prompt,
        });

        const validation = validateAIResponse(response.text)
        if (!validation.valid)
            throw(validation.error)

        res.json({ results: validation.data.results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gemini API error" });
    }
})


function extractJSONFromText(text) {
    if (typeof text !== "string") return null;
    // Remove typical code fences and leading/trailing backticks/tags
    text = text.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "").trim();

    // Find the first {...} JSON object block (greedy to last })
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0].trim() : null;
}

function validateAIResponse(raw) {
    let data;

    // If raw is an object already, use it directly; if string, try to extract JSON
    if (typeof raw === "object" && raw !== null) {
        data = raw;
    } else if (typeof raw === "string") {
        // try to extract JSON block if fences/prefixes exist
        const extracted = extractJSONFromText(raw) || raw;
        try {
            data = JSON.parse(extracted);
        } catch (err) {
            return { valid: false, error: "Invalid JSON format (parse error)." , rawText: raw};
        }
    } else {
        return { valid: false, error: "Input must be a JSON string or an object." };
    }

    // Basic shape check
    if (!data || typeof data !== "object") {
        return { valid: false, error: "Parsed data is not an object." };
    }

    if (!("results" in data)) {
        return { valid: false, error: "Missing top-level 'results' key." };
    }

    if (!Array.isArray(data.results)) {
        return { valid: false, error: "'results' must be an array." };
    }

    if (data.results.length === 0 || data.results.length > 4) {
        return { valid: false, error: "'results' must contain between 1 and 4 items." };
    }

    // Validate each item and normalize types
    const requiredFields = ["name", "description", "longitude", "latitude"];

    for (let i = 0; i < data.results.length; i++) {
        const item = data.results[i];

        if (!item || typeof item !== "object") {
            return { valid: false, error: `Item ${i} is not an object.` };
        }

        for (const field of requiredFields) {
            if (!(field in item)) {
                return { valid: false, error: `Missing field '${field}' in item ${i}.` };
            }
        }

        // name, description, image -> strings
        if (typeof item.name !== "string" || item.name.trim() === "") {
            return { valid: false, error: `'name' must be a non-empty string in item ${i}.` };
        }

        if (typeof item.description !== "string" || item.description.trim() === "") {
            return { valid: false, error: `'description' must be a non-empty string in item ${i}.` };
        }

        // latitude/longitude can be numbers or numeric strings -> normalize to numbers
        const lon = (typeof item.longitude === "number") ? item.longitude : Number(item.longitude);
        const lat = (typeof item.latitude === "number") ? item.latitude : Number(item.latitude);

        if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
            return { valid: false, error: `'longitude' must be a number between -180 and 180 in item ${i}.` };
        }
        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
            return { valid: false, error: `'latitude' must be a number between -90 and 90 in item ${i}.` };
        }

        // Replace with normalized numbers (helps downstream)
        item.longitude = lon;
        item.latitude = lat;
    }

    // All good -> return normalized data
    return { valid: true, data };
}