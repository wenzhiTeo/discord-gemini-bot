import dotenv from "dotenv";
dotenv.config();

const blacklistedChannels = process.env.BLACKLISTED_CHANNEL_IDS
    ? process.env.BLACKLISTED_CHANNEL_IDS.split(",").map(id => id.trim())
    : [];

export default {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    INIT_CHANNEL_ID: process.env.INIT_CHANNEL_ID,
    BLACKLISTED_CHANNEL_IDS: blacklistedChannels,

    MODEL_NAME: "gemini-2.0-flash",
    MAX_HISTORY_LENGTH: 20,
    MAX_MESSAGE_LENGTH: 2000,

    IS_MENTION_ONLY: true,
};