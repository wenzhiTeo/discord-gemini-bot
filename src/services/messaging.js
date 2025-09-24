const config = require("../config");

class MessagingService {
    /**
     * Reply to a message, automatically splitting if too long
     * @param {Object} message - Discord message object to reply to
     * @param {string} content - Content to send
     */
    async reply(message, content) {
        if (content.length <= config.MAX_MESSAGE_LENGTH) {
            return await message.reply(content);
        }

        const chunks = this.splitMessage(content);
        const sentMessages = [];

        for (const chunk of chunks) {
            const sent = await message.reply(chunk);
            sentMessages.push(sent);
        }

        return sentMessages;
    }

    /**
     * Split message into chunks that fit Discord's limit
     * @param {string} content - Content to split
     * @returns {Array} Array of message chunks
     */
    splitMessage(content) {
        return content.match(/[\s\S]{1,1999}/g) || [];
    }
}

module.exports = new MessagingService();