import config from "../config/index.js";

class DirectMessageUtil {
    constructor() {
        this.client = null;
    }

    setClient(client) {
        this.client = client;
    }

    /**
     * Send message to a channel by ID
     * @param {string} channelId - Discord channel ID
     * @param {string} content - Message content
     */
    async sendToChannel(channelId, content) {
        if (!this.client) {
            throw new Error("Client not initialized. Call setClient() first.");
        }

        const channel = await this.client.channels.fetch(channelId);
        if (!channel) {
            throw new Error(`Channel ${channelId} not found`);
        }

        return await this._sendToChannel(channel, content);
    }

    /**
     * Send DM to a user by ID
     * @param {string} userId - Discord user ID
     * @param {string} content - Message content
     */
    async sendToUser(userId, content) {
        if (!this.client) {
            throw new Error("Client not initialized. Call setClient() first.");
        }

        const user = await this.client.users.fetch(userId);
        if (!user) {
            throw new Error(`User ${userId} not found`);
        }

        const dmChannel = await user.createDM();
        return await this._sendToChannel(dmChannel, content);
    }

    /**
     * Send message to a guild's general channel (or first available channel)
     * @param {string} guildId - Discord guild/server ID
     * @param {string} content - Message content
     */
    async sendToGuild(guildId, content) {
        if (!this.client) {
            throw new Error("Client not initialized. Call setClient() first.");
        }

        const guild = await this.client.guilds.fetch(guildId);
        if (!guild) {
            throw new Error(`Guild ${guildId} not found`);
        }

        // Try to find general channel or first text channel
        const channel = guild.channels.cache.find(ch =>
            ch.name === 'general' || ch.name === '一般' || ch.type === 0
        ) || guild.channels.cache.filter(ch => ch.type === 0).first();

        if (!channel) {
            throw new Error(`No text channel found in guild ${guildId}`);
        }

        return await this._sendToChannel(channel, content);
    }

    /**
     * Internal method to send to any channel with message splitting
     * @param {Object} channel - Discord channel object
     * @param {string} content - Message content
     */
    async _sendToChannel(channel, content) {
        if (content.length <= config.MAX_MESSAGE_LENGTH) {
            return await channel.send(content);
        }

        const chunks = this._splitMessage(content);
        const sentMessages = [];

        for (const chunk of chunks) {
            const sent = await channel.send(chunk);
            sentMessages.push(sent);
        }

        return sentMessages;
    }

    /**
     * Split message into chunks that fit Discord's limit
     * @param {string} content - Content to split
     * @returns {Array} Array of message chunks
     */
    _splitMessage(content) {
        return content.match(/[\s\S]{1,1999}/g) || [];
    }

    /**
     * List available channels in a guild
     * @param {string} guildId - Discord guild/server ID
     */
    async listChannels(guildId) {
        if (!this.client) {
            throw new Error("Client not initialized. Call setClient() first.");
        }

        const guild = await this.client.guilds.fetch(guildId);
        if (!guild) {
            throw new Error(`Guild ${guildId} not found`);
        }

        return guild.channels.cache
            .filter(ch => ch.type === 0) // Text channels only
            .map(ch => ({ id: ch.id, name: ch.name }));
    }
}

export default new DirectMessageUtil();