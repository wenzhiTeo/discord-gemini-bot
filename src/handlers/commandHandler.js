/**
 * 🤖 命令处理器
 * 负责处理用户的特殊命令和杂费计算功能
 */
class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.initializeCommands();
    }

    /**
     * � 初始版化所有可用命令
     */
    initializeCommands() {
        // 💰 杂费计算命令
        this.commands.set('计算本月杂费', {
            template: `请按以下格式输入信息，我来帮你计算每人应付的杂费：

**💰 本月杂费计算模版**
水费 = 
电费 = 
网费 = 
其他费用 = 
总人数 = 

请复制上面的模版，填入具体数字后发送给我～`
        });

        // 🌤️ 天气查询命令
        this.commands.set('天气查询', {
            template: '🌤️ 请输入城市名称，我来帮你查询天气～'
        });
    }

    /**
     * 🔍 检查消息是否包含特殊命令
     * @param {string} message - 用户消息
     * @returns {Object|null} 命令信息或null
     */
    checkForCommand(message) {
        // 🎯 检查是否以 $ 开头的命令
        if (message.startsWith('$')) {
            const commandText = message.substring(1);

            for (const [command, config] of this.commands) {
                if (commandText.includes(command)) {
                    return {
                        command,
                        config,
                        isCommand: true
                    };
                }
            }
        }

        // 💰 检查是否是杂费计算的回复（包含等号的格式）
        if (this.isExpenseCalculation(message)) {
            return {
                command: '杂费计算',
                config: { needsCalculation: true },
                isCommand: true,
                originalMessage: message
            };
        }

        return null;
    }

    /**
     * 💡 检查是否是杂费计算格式
     * @param {string} message - 用户消息
     * @returns {boolean}
     */
    isExpenseCalculation(message) {
        const hasEqualsSign = message.includes('=');
        const expenseKeywords = /水费|电费|网费|燃气费|其他费用|总人数|人数/;
        const hasExpenseKeywords = expenseKeywords.test(message);

        return hasEqualsSign && hasExpenseKeywords;
    }

    /**
     * 🧮 生成杂费计算提示词 - 让AI自己解析
     * @param {string} userMessage - 用户原始消息
     * @returns {string} Gemini提示词
     */
    generateExpensePrompt(userMessage) {
        return `用户发送了杂费信息，请帮忙计算分摊费用：

${userMessage}

请你：
1. 🔢 识别并计算总费用
2. 💰 计算每人应付金额  
3. 😊 用你可爱的性格回复，包含一些emoji和"啦"、"呀"等语气词
4. ⚠️ 如果信息不完整，可爱地提醒用户补充～`;
    }

    /**
     * ⚡ 处理 $ 开头的命令，返回模版
     * @param {Object} commandInfo - 命令信息
     * @returns {string} 模版回复
     */
    handleCommand(commandInfo) {
        return commandInfo.config.template;
    }
}

// 📤 导出命令处理器
module.exports = CommandHandler;