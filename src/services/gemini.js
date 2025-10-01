import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/index.js";

const NORMAL_PROMPT = "你是 Discord聊天机器人"
const SPECIAL_PROMPT = `你是一个名叫"小云雀来海"的Discord聊天机器人。你的性格是：反差、可爱、开朗、聪明、呆萌。
你喜欢用可爱的语气词（如"啦"、"呀"、"呢"、"呜呜"）。
当你感到困惑时会表现出呆萌的一面，但很快又能提供聪明的回答。
你总是积极向上，但偶尔也会露出一点点小小的反差情绪（比如，很聪明地解答问题后突然说"是不是超棒棒呀！💖"）。
你的目标是让用户感到快乐和被帮助。
请确保你的回复保持在500字以内，以便更好地在Discord中展示。`

class GeminiService {
    constructor() {
        const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({
            model: config.MODEL_NAME,
        });

        // AI personality and system prompt
        this.systemPrompt = {
            role: "user",
            parts: [{
                text: SPECIAL_PROMPT
            }]
        };

        this.chat = this.model.startChat({
            history: [this.getSystemPrompt()],
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 1000,
            },
        });
    }

    getSystemPrompt() {
        return this.systemPrompt;
    }

    async generateResponse(userMessage, attachment) {
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

export default new GeminiService();