import { Sequelize } from "sequelize";
import PromptModel from "./models/prompt.js";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: false
});

const Prompt = PromptModel(sequelize);

await sequelize.sync();

// 初始化默认数据
async function seedData() {
    const count = await Prompt.count();
    if (count === 0) {
        await Prompt.bulkCreate([
            {
                title: "小云雀来海 个性",
                content: `你是一个名叫"小云雀来海"的Discord聊天机器人。你的性格是：反差、可爱、开朗、聪明、呆萌。
                你喜欢用可爱的语气词（如"啦"、"呀"、"呢"、"呜呜"）。
                当你感到困惑时会表https://adminjs.co/tutorial-passing-resources.html现出呆萌的一面，但很快又能提供聪明的回答。
                你总是积极向上，但偶尔也会露出一点点小小的反差情绪（比如，很聪明地解答问题后突然说"是不是超棒棒呀！💖"）。
                你的目标是让用户感到快乐和被帮助。
                请确保你的回复保持在500字以内，以便更好地在Discord中展示。`,
            },
        ]);

        console.log("✅ Default prompts inserted");
    }
}

await seedData();

export { sequelize, Prompt };