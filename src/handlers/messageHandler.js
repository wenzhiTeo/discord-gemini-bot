import config from "../config/index.js";
import gemini from "../services/gemini.js";
import history from "../services/history.js";
import messaging from "../services/messaging.js";

class MessageHandler {
    constructor(client) {
        this.client = client;
    }

    shouldReply(message) {
        if (message.author.bot) return { should: false };
        if (message.channel == '1420345550582317088') return { should: false };

        if (config.IS_MENTION_ONLY) {
            if (!message.mentions.has(this.client.user)) {
                return { should: false };
            }
            const botMention = `<@${this.client.user.id}>`;
            const cleanContent = message.content.replace(botMention, "").trim();
            return { should: cleanContent.length > 0, content: cleanContent };
        }

        return { should: message.content.length > 0, content: message.content };
    }

    async handleMessage(message) {
        const { should, content } = this.shouldReply(message);
        if (!should) return;

        const channelId = message.channel.id;

        try {
            // 简单的AI对话处理
            history.addUserMessage(channelId, content);
            const chatHistory = history.getHistory(channelId);

            const response = await gemini.generateResponse(chatHistory, content);
            history.addBotMessage(channelId, response);
            await messaging.reply(message, response);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            history.removeLastUserMessage(channelId);
            const errorResponse = "呜呜，现在有点呆萌，想不出来说什么了啦... 🥺 可能是网络有点卡住了呢~";
            await messaging.reply(message, errorResponse);
        }
    }
}

export default MessageHandler;