const { Client, Events, GatewayIntentBits } = require("discord.js");
const config = require("./src/config");
const MessageHandler = require("./src/handlers/messageHandler");
const directMessage = require("./src/utils/directMessage");

// --- Discord 客户端初始化 ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const messageHandler = new MessageHandler(client);

// --- 机器人上线 ---
client.on(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    // Initialize direct message utility
    directMessage.setClient(client);

    // Make it globally available for easy access
    global.sendMessage = directMessage;

    await sendMessage.sendToChannel("1420345550582317088", "Personal bot ONLINE");

});

// --- 消息事件 ---
client.on(Events.MessageCreate, async (message) => {
    await messageHandler.handleMessage(message);
});

// --- 登录 Discord ---
client.login(config.DISCORD_TOKEN);