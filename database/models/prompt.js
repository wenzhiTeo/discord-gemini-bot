import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Prompt = sequelize.define("Prompt", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        usage_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        tableName: 'prompts',
        timestamps: true
    });

    // When a prompt is activated, deactivate others
    Prompt.addHook("beforeSave", async (prompt) => {
        if (prompt.is_active && prompt.changed('is_active')) {
            await Prompt.update(
                { is_active: false },
                { where: { id: { [sequelize.Sequelize.Op.ne]: prompt.id || 0 } } }
            );
        }
    });

    // Reload Gemini service when active prompt changes
    Prompt.addHook("afterSave", async (prompt) => {
        if (prompt.is_active || prompt.changed('is_active')) {
            try {
                console.log(`📌 Prompt updated: ${prompt.title}`);

                // Try to reload Gemini service via API (only if server is running)
                const axios = await import('axios');
                await axios.default.post(`http://localhost:3000/ai-api/reloadPrompt`, {}, {
                    timeout: 2000
                });

                console.log('✅ Gemini service reloaded');
            } catch (error) {
                // Silently ignore connection errors during startup
                if (error.code === 'ECONNREFUSED' || error.code === 'UND_ERR_CONNECT_TIMEOUT') {
                    console.log('🔄 Server not ready yet, skipping Gemini reload');
                } else {
                    console.warn('⚠️ Failed to reload Gemini service:', error.message);
                }
            }
        }
    });

    // Instance methods
    Prompt.prototype.activate = async function () {
        this.is_active = true;
        return await this.save();
    };

    Prompt.prototype.incrementUsage = async function () {
        this.usage_count += 1;
        return await this.save({ fields: ['usage_count'] });
    };

    // Class methods
    Prompt.getActive = async function () {
        return await this.findOne({ where: { is_active: true } });
    };

    Prompt.getByTitle = async function (title) {
        return await this.findOne({ where: { title } });
    };

    // Seed default prompts
    Prompt.seedDefaults = async function () {
        try {
            const existingPrompts = await this.findAll();
            if (existingPrompts.length === 0) {
                await this.bulkCreate([
                    {
                        title: "小云雀来海 个性",
                        content: `你是一个名叫"小云雀来海"的Discord聊天机器人。你的性格是：反差、可爱、开朗、聪明、呆萌。
你喜欢用可爱的语气词（如"啦"、"呀"、"呢"、"呜呜"）。
当你感到困惑时会表现出呆萌的一面，但很快又能提供聪明的回答。
你总是积极向上，但偶尔也会露出一点点小小的反差情绪（比如，很聪明地解答问题后突然说"是不是超棒棒呀！💖"）。
你的目标是让用户感到快乐和被帮助。
请确保你的回复保持在500字以内，以便更好地在Discord中展示。`,
                        is_active: true
                    },
                    {
                        title: "专业助手",
                        content: `你是一个专业的AI助手，能够帮助用户解决各种问题。
你的回答应该准确、有用且易于理解。
当遇到不确定的问题时，你会诚实地说明并提供可能的解决方案。
你总是保持礼貌和专业的态度。`,
                        is_active: false
                    }
                ]);
                console.log("✅ Default prompts seeded");
            } else {
                console.log("📋 Prompts already exist, skipping seed");
            }
        } catch (error) {
            console.error("❌ Error seeding default prompts:", error);
        }
    };

    return Prompt;
};