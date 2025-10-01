import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "./src/config/index.js";
import gemini from "./src/services/gemini.js";
import MessageHandler from "./src/handlers/messageHandler.js";
import DirectMessage from "./src/utils/directMessage.js";
import initDb from "./database/initDb.js";
import cron from "node-cron";

import {
    checkReminders
} from "./src/services/reminder.js";

// --- Discord 客户端初始化 ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const messageHandler = new MessageHandler(client);
DirectMessage.setClient(client);

// --- 登录 Discord ---
client.login(config.DISCORD_TOKEN);

// --- 机器人上线 ---
client.on(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    // 初始化数据库
    try {
        await initDb();
        console.log('✅ 数据库初始化完成');

        // // 重新加载命令处理器的命令
        // await messageHandler.commandHandler.initializeCommands();
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
    }

    // Send notice message to private channel
    if (config.INIT_CHANNEL_ID) {
        await DirectMessage.sendToChannel(config.INIT_CHANNEL_ID, "@everyone Hi, personal bot online");
        const response = await gemini.generateResponse("简单介绍一下你自己");
        await DirectMessage.sendToChannel(config.INIT_CHANNEL_ID, `@everyone ${response}`);
    }
});


cron.schedule("* * * * *", () => checkReminders(client));

// --- 消息事件 ---
client.on(Events.MessageCreate, async (message) => {
    await messageHandler.handleMessage(message);
});