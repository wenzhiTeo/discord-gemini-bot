import dotenv from "dotenv";
dotenv.config();

const config = {
    // Discord
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,

    // Gemini
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MODEL_NAME: process.env.MODEL_NAME || "gemini-2.0-flash-exp",

    // Bot settings
    INIT_CHANNEL_ID: process.env.INIT_CHANNEL_ID,
    BLACKLISTED_CHANNEL_IDS: process.env.BLACKLISTED_CHANNEL_IDS?.split(",").map(id => id.trim()) || [],
    IS_MENTION_ONLY: process.env.IS_MENTION_ONLY !== 'false',

    // Limits
    MAX_HISTORY_LENGTH: parseInt(process.env.MAX_HISTORY_LENGTH) || 20,
    MAX_MESSAGE_LENGTH: parseInt(process.env.MAX_MESSAGE_LENGTH) || 2000,

    // Server
    PORT: parseInt(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Features
    ENABLE_DEBUG_LOGS: process.env.ENABLE_DEBUG_LOGS === 'true',

    // Image processing
    IMAGE_DOWNLOAD_TIMEOUT: parseInt(process.env.IMAGE_DOWNLOAD_TIMEOUT) || 15000,
    IMAGE_DOWNLOAD_RETRIES: parseInt(process.env.IMAGE_DOWNLOAD_RETRIES) || 3,
};

// Validate required fields
if (!config.DISCORD_TOKEN || !config.GEMINI_API_KEY) {
    console.error('❌ Missing required environment variables: DISCORD_TOKEN, GEMINI_API_KEY');
    process.exit(1);
}

export default config;