const config = require("../config");
const gemini = require("./gemini");

class HistoryManager {
    constructor() {
        this.conversationHistory = new Map();
    }

    getHistory(channelId) {
        if (!this.conversationHistory.has(channelId)) {
            this.conversationHistory.set(channelId, [gemini.getSystemPrompt()]);
        }
        return this.conversationHistory.get(channelId);
    }

    addUserMessage(channelId, message) {
        const history = this.getHistory(channelId);
        history.push({ role: "user", parts: [{ text: message }] });
    }

    addBotMessage(channelId, message) {
        const history = this.getHistory(channelId);
        history.push({ role: "model", parts: [{ text: message }] });
        this.trimHistory(channelId);
    }

    trimHistory(channelId) {
        const history = this.getHistory(channelId);
        if (history.length > config.MAX_HISTORY_LENGTH) {
            history.splice(1, history.length - config.MAX_HISTORY_LENGTH);
        }
    }

    removeLastUserMessage(channelId) {
        const history = this.getHistory(channelId);
        if (history[history.length - 1]?.role === "user") {
            history.pop();
        }
    }

    clearHistory(channelId) {
        this.conversationHistory.set(channelId, [gemini.getSystemPrompt()]);
    }
}

module.exports = new HistoryManager();