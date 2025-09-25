const { Client, Events, GatewayIntentBits } = require("discord.js");
const config = require("./src/config");
const gemini = require("./src/services/gemini");
const MessageHandler = require("./src/handlers/messageHandler");
const DirectMessage = require("./src/utils/directMessage");

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

    // Send notice message to private channel
    if (config.PRIVATE_CHANNEL_ID) {
        await DirectMessage.sendToChannel(config.PRIVATE_CHANNEL_ID, "@everyone Hi, personal bot online");
        const response = await gemini.generateResponse([gemini.getSystemPrompt()], "简单介绍一下你自己");
        await DirectMessage.sendToChannel(config.PRIVATE_CHANNEL_ID, `@everyone ${response}`);
    }
});

// --- 消息事件 ---
client.on(Events.MessageCreate, async (message) => {
    await messageHandler.handleMessage(message);
});

