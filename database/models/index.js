import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "bot.db",
    logging: false,
});

// 测试连接
(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ 数据库连接成功");
    } catch (error) {
        console.error("❌ 数据库连接失败:", error);
    }
})();

// AI Template 表 - 存储AI提示词模板
export const Template = sequelize.define(
    "Template",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        prompt: { type: DataTypes.TEXT, allowNull: false },
        description: { type: DataTypes.TEXT },
        is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
        tableName: "templates",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default sequelize;