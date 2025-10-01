import config from "../config/index.js";
import gemini from "../services/gemini.js";
import messaging from "../services/messaging.js";

import {
    handleSetReminderCommand,
    handleTemplateReply
} from "../services/reminder.js";

class MessageHandler {
    constructor(client) {
        this.client = client;
        this.templateMessageIds = new Set();
    }

    shouldReply(message) {
        if (config.BLACKLISTED_CHANNEL_IDS.includes(message.channel)) {
            return { should: false }
        }
        if (message.author.bot) return { should: false };

        let content = message.content

        if (config.IS_MENTION_ONLY) {
            if (!message.mentions.has(this.client.user)) {
                return { should: false };
            }
            const botMention = `<@${this.client.user.id}>`;
            const cleanContent = message.content.replace(botMention, "").trim();

            content = cleanContent
        }

        return { should: content.length > 0, content: content };
    }

    async handleMessage(message) {
        const { should, content } = this.shouldReply(message);
        if (!should) return;

        // handle custom template
        if (content.trim().startsWith("$设置定时提醒")) {
            return handleSetReminderCommand(message);
        }
        if (await handleTemplateReply(message)) return;


        // handle common discord message
        const discordAttachment = message.attachments.first();
        const attachment = discordAttachment
            ? {
                contentType: discordAttachment.contentType,
                url: discordAttachment.url,
            }
            : null;

        try {
            const response = await gemini.generateResponse(content, attachment);
            await messaging.reply(message, response);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorResponse = "呜呜，现在有点呆萌，想不出来说什么了啦... 🥺 可能是网络有点卡住了呢~";
            await messaging.reply(message, errorResponse);
        }
    }
}

export default MessageHandler;