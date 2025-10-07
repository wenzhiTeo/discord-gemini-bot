import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "./src/config/index.js";
import geminiService from "./src/services/gemini.js";
import MessageHandler from "./src/handlers/messageHandler.js";
import messaging from "./src/services/messaging.js";
import { sequelize, initializeDatabase } from "./database/index.js";
import expressStart from "./src/server.js";
import CommandHandler from "./src/handlers/commandHandler.js";
import { setupCronJobs } from "./src/handlers/cronScheduler.js";
import { ReminderService } from "./src/services/reminder.js";

// Initialize services
try {
    await initializeDatabase();
    await geminiService.init();
    console.log("✅ Services ready");
} catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
}

// Setup Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.login(config.DISCORD_TOKEN);
messaging.setClient(client);

const messageHandler = new MessageHandler(client);
const commandHandler = new CommandHandler(client, config.DISCORD_TOKEN);

// Setup services
const services = {
    reminderService: new ReminderService(client)
};
setupCronJobs(client, services);

// Bot ready
client.on(Events.ClientReady, async (c) => {
    console.log(`✅ Bot ready: ${c.user.tag}`);

    if (config.INIT_CHANNEL_ID) {
        messaging.sendIntroMessage(config.INIT_CHANNEL_ID, geminiService);
    }

    commandHandler.registerCommands();
    commandHandler.setupListeners(services);
});

// Handle messages
client.on(Events.MessageCreate, async (message) => {
    await messageHandler.handleMessage(message);
});

// Start web server
expressStart(sequelize, geminiService);

