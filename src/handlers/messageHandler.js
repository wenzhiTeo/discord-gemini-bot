const config = require("../config");
const gemini = require("../services/gemini");
const history = require("../services/history");
const messaging = require("../services/messaging");
const CommandHandler = require("./commandHandler");

class MessageHandler {
    constructor(client) {
        this.client = client;
        this.commandHandler = new CommandHandler();
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
        const commandInfo = this.commandHandler.checkForCommand(content);

        // $ 开头的命令 - 直接返回模板
        if (commandInfo && !commandInfo.config.needsCalculation) {
            const commandResult = this.commandHandler.handleCommand(commandInfo);
            await messaging.reply(message, commandResult);
            return;
        }

        // 杂费计算或普通消息 - 都用 AI 处理
        history.addUserMessage(channelId, content);

        try {
            const chatHistory = history.getHistory(channelId);
            let prompt = content;

            // 如果是杂费计算，使用特殊提示词
            if (commandInfo && commandInfo.config.needsCalculation) {
                prompt = this.commandHandler.generateExpensePrompt(content);
            }

            const response = await gemini.generateResponse(chatHistory, prompt);
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