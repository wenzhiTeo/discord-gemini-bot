import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/index.js";
import { Prompt } from "../../database/index.js";

const DEFAULT_PROMPT = "你是一个Discord聊天机器人，友好、有帮助且富有创造力。";

class GeminiService {
    constructor() {
        this.chat = null;
        this.model = null;
        this.is_active = false;
    }

    async init() {
        try {
            const prompt = await this.getSystemPrompt();
            const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

            this.model = genAI.getGenerativeModel({
                model: config.MODEL_NAME,
                systemInstruction: prompt,
            });

            this.chat = this.model.startChat({
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1000,
                }
            });

            this.is_active = true;
            console.log("✅ Gemini ready");
        } catch (error) {
            console.error("❌ Gemini init failed:", error);
            throw error;
        }
    }

    async reloadPrompt() {
        if (!this.is_active) return;
        console.log("♻️ Reloading prompt...");
        await this.init();
    }

    async getSystemPrompt() {
        try {
            const prompt = await Prompt.getActive();
            return prompt ? prompt.content : DEFAULT_PROMPT;
        } catch (error) {
            console.error("❌ Error getting prompt -> use default prompt");
            return DEFAULT_PROMPT;
        }
    }

    async generateResponse(userMessage, attachment) {
        if (!this.is_active) throw new Error("Gemini not initialized");
        if (!userMessage && !attachment) throw new Error("No content provided");

        try {
            const parts = [];

            if (userMessage?.trim()) {
                parts.push({ text: userMessage });
            }

            if (attachment) {
                const imageData = await this.downloadImage(attachment.url);
                if (imageData) {
                    parts.push({
                        inlineData: {
                            mimeType: attachment.contentType,
                            data: imageData,
                        },
                    });
                }
            }

            const result = await this.chat.sendMessage(parts);
            return result.response.text();
        } catch (error) {
            console.error("❌ Generate response failed:", error);
            throw error;
        }
    }

    async downloadImage(url, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.IMAGE_DOWNLOAD_TIMEOUT);

                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const buffer = await response.arrayBuffer();
                return Buffer.from(buffer).toString("base64");
            } catch (error) {
                console.error(`❌ Image download attempt ${i + 1} failed:`, error.message);
                if (i === retries - 1) return null;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
        return null;
    }

    getStatus() {
        return {
            active: this.is_active,
            model: config.MODEL_NAME
        };
    }
}

const geminiService = new GeminiService();
export default geminiService;