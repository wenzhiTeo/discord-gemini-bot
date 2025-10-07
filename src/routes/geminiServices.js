import express from "express";

export default function createGeminiServicesRoute(geminiService) {
    const router = express.Router();

    // API route: reload Gemini prompt
    router.post("/reloadPrompt", async (req, res) => {
        try {
            await geminiService.reloadPrompt();
            res.json({ success: true, message: "Prompt reloaded" });
        } catch (err) {
            console.error("❌ Failed to reload prompt:", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });

    return router;
}

