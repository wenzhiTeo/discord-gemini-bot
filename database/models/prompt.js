// models/prompt.js
import { DataTypes } from "sequelize";
import axios from "axios";

export default (sequelize) => {
    const Prompt = sequelize.define("Prompt", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    // hook：当某个 prompt 设置为 active 时，把其他 prompt 全部设为 false
    Prompt.addHook("beforeSave", async (prompt, options) => {
        if (prompt.is_active) {
            await Prompt.update(
                { is_active: false },
                {
                    where: { id: { [sequelize.Sequelize.Op.ne]: prompt.id } },
                    transaction: options.transaction, // 保证事务安全
                }
            );
        }
    });

    // Hook to reload gemini service after prompt save
    Prompt.addHook("afterSave", async (prompt, options) => {
        console.log("📌 Prompt saved:", prompt.title);
        await axios.post("http://localhost:3000/reloadPrompt");
    });

    return Prompt;
};