import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/index.js";
import { Prompt } from "../../database/index.js";

const DEFAULT_PROMPT = "你是 Discord聊天机器人"
const DEFAULT_GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
}

class GeminiService {
    constructor() {
        this.chat = null;
        this.model = null;
        this.is_active = false;
    }

    async init() {
        const prompt = await this.getSystemPrompt();
        const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

        this.model = genAI.getGenerativeModel({
            model: config.MODEL_NAME,
            systemInstruction: prompt,
        });

        this.chat = this.model.startChat({
            generationConfig: DEFAULT_GENERATION_CONFIG,
        });

        this.is_active = true;
        console.log("✅ GeminiService initialized with system prompt");
    }

    async reloadPrompt() {
        if (!this.is_active) {
            console.log("⚠️ GeminiService not active, skip reload");
            return;
        }
        console.log("♻️ Reloading Gemini prompt...");
        await this.init();
    }

    async getSystemPrompt() {
        const prompt = await Prompt.findOne({
            where: { is_active: true },
            order: [["createdAt", "DESC"]]
        });
        console.log(`Prompt: %s`, prompt ? prompt.title : 'DEFAULT');
        return prompt ? prompt.content : DEFAULT_PROMPT;
    }

    async generateResponse(userMessage, attachment) {
        if (!this.is_active) throw new Error("GeminiService not initialized");
        const parts = [{ text: userMessage }];

        if (attachment) {
            // 下载图片并转 base64
            const res = await fetch(attachment.url);
            const buffer = await res.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");

            parts.push({
                inlineData: {
                    mimeType: attachment.contentType,
                    data: base64,
                },
            });
        }

        const result = await this.chat.sendMessage(parts);

        return result.response.text();
    }
}

const geminiService = new GeminiService();
export default geminiService;