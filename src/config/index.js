require("dotenv").config();

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    IS_MENTION_ONLY: true,
    MODEL_NAME: "gemini-2.0-flash",
    MAX_HISTORY_LENGTH: 20,
    MAX_MESSAGE_LENGTH: 2000,
};