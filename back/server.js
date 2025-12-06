import express from "express";
import {GoogleGenAI} from '@google/genai';
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*"
}));

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const searchPrompt = `You must return only a valid, plain JSON object.
Find up to 4 places that match the user's description, prioritizing the most popular ones.
Each place must match exactly the structure of the following class:

class Place {
  name: string;
  description: string;
  longitude: number;
  latitude: number;
}

Requirements:
- Output must contain a single top-level object with an array called "results".
- "results" must contain between 1 and 4 objects of type Place.
- "description" must be brief but precise (2-3 sentences).
- All text fields must use the same language in which the user wrote the description.
- Coordinates must be real and plausible.
- Return only the JSON. No explanations, no formatting, no extra text.

The user's description is: `

app.listen(3000, () => {
  console.log("API listening on port 3000");
});

app.post("/api/search", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "No se recibió prompt" });


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


function stripCodeFences(text) {
  if (!text || typeof text !== "string") return text;

  // Remove leading fences like ``` or ```json
  text = text.trim().replace(/^```[a-zA-Z]*\s*\n?/, "");

  // Remove trailing ```
  text = text.replace(/\n?```$/, "");

  return text.trim();
}

function validateAIResponse(raw) {
    let data;

    // If raw is an object already, use it directly; if string, try to extract JSON
    if (typeof raw === "object" && raw !== null) {
        data = raw;
    } else if (typeof raw === "string") {
        // try to extract JSON block if fences/prefixes exist
        const cleaned = stripCodeFences(raw) || raw;
        try {
            data = JSON.parse(cleaned);
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