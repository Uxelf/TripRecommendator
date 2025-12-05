import express from "express";
import {GoogleGenAI} from '@google/genai';
const app = express();
app.use(express.json());

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

app.listen(3000, () => {
  console.log("API listening on port 3000");
});

app.post("/api/search", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "No se recibió prompt" });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ response: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gemini API error" });
    }
})
