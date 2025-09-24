const config = require("../config");
const gemini = require("../services/gemini");
const history = require("../services/history");
const messaging = require("../services/messaging");

class MessageHandler {
    constructor(client) {
        this.client = client;
    }

    shouldReply(message) {
        if (message.author.bot) return { should: false };

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

        history.addUserMessage(channelId, content);

        try {
            const chatHistory = history.getHistory(channelId);
            const response = await gemini.generateResponse(chatHistory, content);

            history.addBotMessage(channelId, response);
            await messaging.reply(message, response);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            history.removeLastUserMessage(channelId);
            await messaging.reply(message, "呜呜，现在有点呆萌，想不出来说什么了啦... 🥺 可能是网络有点卡住了呢~");
        }
    }
}

module.exports = MessageHandler;