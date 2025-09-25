import dotenv from "dotenv";
dotenv.config();

export default {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MODEL_NAME: "gemini-2.0-flash",
    MAX_HISTORY_LENGTH: 20,
    MAX_MESSAGE_LENGTH: 2000,

    IS_MENTION_ONLY: true,

    PRIVATE_CHANNEL_ID: process.env.PRIVATE_CHANNEL_ID,
};