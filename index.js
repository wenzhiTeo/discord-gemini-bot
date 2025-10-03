import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "./src/config/index.js";
import geminiService from "./src/services/gemini.js";
import MessageHandler from "./src/handlers/messageHandler.js";
import DirectMessage from "./src/utils/directMessage.js";
import cron from "node-cron";
import { sequelize } from "./database/index.js";
import {
    checkReminders
} from "./src/services/reminder.js";

import expressStart from "./src/server.js"

// --- Discord 客户端初始化 ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

try {
    await sequelize.sync();
    console.log('✅ Database Resource Ready');

    await geminiService.init();
    console.log("✅ Gemini ready");
} catch (err) {
    console.error("❌ Startup failed:", err);
}

client.login(config.DISCORD_TOKEN);
const messageHandler = new MessageHandler(client);
DirectMessage.setClient(client);

// --- Bot online ---
client.on(Events.ClientReady, async (c) => {
    console.log(`✅ Ready! Logged in as ${c.user.tag}`);

    // Send notice message to private channel
    if (config.INIT_CHANNEL_ID) {
        try {
            await DirectMessage.sendToChannel(config.INIT_CHANNEL_ID, "@everyone Hi, personal bot online");
            const response = await geminiService.generateResponse("简单介绍一下你自己");
            await DirectMessage.sendToChannel(config.INIT_CHANNEL_ID, `@everyone ${response}`);

            console.log("✅ Init message sent to channel");
        } catch (err) {
            console.error("❌ Failed to send init message", err);
        }
    }
});

cron.schedule("* * * * *", () => checkReminders(client));

// --- 消息事件 ---
client.on(Events.MessageCreate, async (message) => {
    await messageHandler.handleMessage(message);
});

expressStart(sequelize, geminiService)

