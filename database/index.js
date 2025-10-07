import { Sequelize } from "sequelize";
import config from "../src/config/index.js";
import PromptModel from "./models/prompt.js";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: config.ENABLE_DEBUG_LOGS ? console.log : false
});

const Prompt = PromptModel(sequelize);

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Sync database schema without dropping existing data
        await sequelize.sync();
        console.log('✅ Database synced');

        await Prompt.seedDefaults();
        console.log('✅ Database ready');
    } catch (error) {
        console.error('❌ Database failed:', error);
        throw error;
    }
}

export { sequelize, Prompt, initializeDatabase };