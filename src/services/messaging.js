import config from "../config/index.js";

class MessagingService {
    constructor() {
        this.client = null;
    }

    setClient(client) {
        this.client = client;
    }

    async reply(message, content) {
        if (!content?.trim()) return;

        try {
            if (content.length <= config.MAX_MESSAGE_LENGTH) {
                return await message.reply({
                    content: content.trim(),
                    allowedMentions: { repliedUser: false }
                });
            }

            // Split long messages
            const chunks = content.match(/.{1,1900}/g) || [];
            const messages = [];

            for (let i = 0; i < chunks.length; i++) {
                const chunk = i === 0 ? chunks[i] : `*[${i + 1}/${chunks.length}]*\n${chunks[i]}`;
                const sent = i === 0
                    ? await message.reply({ content: chunk, allowedMentions: { repliedUser: false } })
                    : await message.channel.send(chunk);
                messages.push(sent);
            }

            return messages;
        } catch (error) {
            console.error('❌ Error sending reply:', error);
            return null;
        }
    }

    async send(channelId, content) {
        if (!this.client || !content?.trim()) return;

        try {
            const channel = await this.client.channels.fetch(channelId);
            return await channel.send(content.trim());
        } catch (error) {
            console.error('❌ Error sending message:', error);
            return null;
        }
    }

    async sendIntroMessage(channelId, geminiService) {
        try {
            await this.send(channelId, "@everyone 🤖 AI assistant is now ONLINE!");

            if (geminiService?.is_active) {
                const response = await geminiService.generateResponse("简单介绍一下你自己，用一段话");
                await this.send(channelId, `@everyone ${response}`);
            }

            console.log("✅ Introduction message sent");
        } catch (error) {
            console.error("❌ Failed to send introduction:", error);
        }
    }
}

export default new MessagingService();