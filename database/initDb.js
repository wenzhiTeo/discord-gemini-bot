import sequelize, { Template } from './models/index.js';

/**
 * 初始化数据库和示例数据
 */
async function initDb() {
    try {
        // 同步数据库结构
        await sequelize.sync({ force: false });
        console.log('✅ 数据库表同步完成');

        // 添加示例模板数据
        const sampleTemplates = [
            {
                name: '默认对话',
                prompt: '你是一个名叫"小云雀来海"的Discord聊天机器人。你的性格是：反差、可爱、开朗、聪明、呆萌。你喜欢用可爱的语气词（如"啦"、"呀"、"呢"、"呜呜"）。',
                description: '默认的对话提示词',
                is_active: true
            },
            {
                name: '杂费计算',
                prompt: '用户发送了杂费信息，请帮忙计算分摊费用。用可爱的语气回复，包含emoji和"啦"、"呀"等语气词。',
                description: '杂费计算专用提示词',
                is_active: false
            },
            {
                name: '天气查询',
                prompt: '用户想查询天气信息。提醒用户你无法实时查询天气，但可以建议使用天气应用。用可爱积极的语气回复。',
                description: '天气查询专用提示词',
                is_active: false
            }
        ];

        for (const template of sampleTemplates) {
            await Template.findOrCreate({
                where: { name: template.name },
                defaults: template
            });
        }

        console.log('✅ 示例数据初始化完成');

    } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
    }
}

export default initDb;