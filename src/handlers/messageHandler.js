import config from "../config/index.js";
import gemini from "../services/gemini.js";
import messaging from "../services/messaging.js";

class MessageHandler {
    constructor(client) {
        this.client = client;
        this.processing = new Set();
    }

    shouldReply(message) {
        if (config.BLACKLISTED_CHANNEL_IDS.includes(message.channel.id)) return { should: false };
        if (message.author.bot || message.system) return { should: false };

        let content = message.content;

        if (config.IS_MENTION_ONLY) {
            if (!message.mentions.has(this.client.user)) return { should: false };
            content = message.content.replace(`<@${this.client.user.id}>`, "").trim();
        }

        const hasContent = content.length > 0;
        const hasAttachments = message.attachments.size > 0;

        return {
            should: hasContent || hasAttachments,
            content,
            hasAttachments
        };
    }

    processAttachment(message) {
        const attachment = message.attachments.first();
        if (!attachment) return null;

        const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!supportedTypes.includes(attachment.contentType)) return null;

        return {
            contentType: attachment.contentType,
            url: attachment.url,
            name: attachment.name
        };
    }

    async handleMessage(message) {
        if (this.processing.has(message.id)) return;
        this.processing.add(message.id);

        try {
            const { should, content } = this.shouldReply(message);
            if (!should) return;

            await message.channel.sendTyping();

            const attachment = this.processAttachment(message);
            const response = await gemini.generateResponse(content, attachment);

            if (response?.trim()) {
                await messaging.reply(message, response);
                console.log(`✅ Replied to ${message.author.username}`);
            }
        } catch (error) {
            console.error(`❌ Message handling failed:`, error);

            const errorMessages = [
                "呜呜，现在有点呆萌，想不出来说什么了啦... 🥺",
                "抱歉，我的大脑暂时短路了一下 🤖💭",
                "哎呀，遇到了一点小问题，请稍后再试试吧~ 😅"
            ];

            const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            await messaging.reply(message, randomError);
        } finally {
            setTimeout(() => this.processing.delete(message.id), 5000);
        }
    }
}

export default MessageHandler;