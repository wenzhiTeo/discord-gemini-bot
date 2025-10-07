# Discord AI 聊天机器人

一个基于 Google Gemini AI 的 Discord 机器人，支持智能对话、定时提醒和网页管理界面。

## 🎯 主要功能

- **🤖 AI 聊天**：使用 Google Gemini 2.0 进行自然对话
- **📷 图片分析**：上传图片让 AI 分析内容
- **⏰ 定时提醒**：设置提醒消息，到时间自动发送
- **🛠️ 网页管理**：通过浏览器管理机器人设置

## 🚀 快速开始

### 准备工作
- 安装 Node.js (版本 18 或更高)
- 获取 Discord 机器人令牌：[点击这里](https://discord.com/developers/applications)
- 获取 Google Gemini API 密钥：[点击这里](https://makersuite.google.com/app/apikey)

### 安装步骤

1. **下载代码**
   ```bash
   git clone <仓库地址>
   cd discord-gemini-bot
   npm install
   ```

2. **配置环境变量**
   创建 `.env` 文件：
   ```env
   DISCORD_TOKEN=你的Discord机器人令牌
   GEMINI_API_KEY=你的Gemini_API密钥
   INIT_CHANNEL_ID=启动通知频道ID（可选）
   BLACKLISTED_CHANNEL_IDS=忽略的频道ID，用逗号分隔（可选）
   ```

3. **Discord 机器人权限设置**
   
   在 Discord 开发者面板中，确保机器人有以下权限：
   - 发送消息
   - 读取消息历史
   - 使用斜杠命令
   - 提及所有人
   - 附加文件
   
   并启用以下意图：
   - 消息内容意图
   - 服务器成员意图

4. **启动机器人**
   ```bash
   npm start
   ```
   
   **可用地址：**
   - 管理面板：`http://localhost:3000/admin`
   - 健康检查：`http://localhost:3000/health`

## 📖 使用方法

### 基本命令

#### 💬 与 AI 聊天
```
@你的机器人 你好！今天怎么样？
@你的机器人 [上传图片] 这张图片里有什么？
```

#### 🔧 斜杠命令
```
/help                    # 显示所有可用命令
/ping                    # 检查机器人延迟和状态
/remind                  # 设置特定时间的提醒
/reminders               # 列出所有活跃提醒
/clear-reminders         # 清除所有活跃提醒
```

#### ⏰ 设置提醒
使用 `/remind` 命令，时间格式为 HHMM：
```
/remind time:1430 message:开会提醒
/remind time:0900 message:吃药时间
/remind time:2000 message:给妈妈打电话
```

### 管理面板

访问 `http://localhost:3000/admin` 可以：

- **📝 管理提示词**：创建和编辑 AI 个性风格
- **🔄 实时更新**：提示词修改后自动重载 AI 服务
- **📊 使用统计**：查看提示词使用次数和活动情况
- **⚙️ 数据库管理**：浏览和管理所有存储的数据

### 启动选项

```bash
# 启动机器人和管理面板（推荐）
npm start
```

## ⚙️ 配置说明

### 环境变量

| 变量名                    | 说明                      | 必需 | 示例                 |
| ------------------------- | ------------------------- | ---- | -------------------- |
| `DISCORD_TOKEN`           | Discord 机器人令牌        | ✅    | `MTIzNDU2Nzg5...`    |
| `GEMINI_API_KEY`          | Google Gemini API 密钥    | ✅    | `AIzaSyC...`         |
| `INIT_CHANNEL_ID`         | 启动通知频道 ID           | ❌    | `123456789012345678` |
| `BLACKLISTED_CHANNEL_IDS` | 忽略的频道 ID（逗号分隔） | ❌    | `123,456,789`        |

### 高级设置

编辑 `src/config/index.js`：

```javascript
{
  MODEL_NAME: "gemini-2.0-flash",        // AI 模型版本
  MAX_MESSAGE_LENGTH: 2000,              // Discord 消息长度限制
  IS_MENTION_ONLY: true,                 // 是否只在被@时回复
  MAX_HISTORY_LENGTH: 20                 // 聊天上下文长度
}
```

## 📁 项目结构

```
discord-gemini-bot/
├── 📂 src/
│   ├── 📂 commands/        # Discord 斜杠命令
│   ├── 📂 config/          # 机器人配置
│   ├── 📂 handlers/        # 消息和命令处理
│   ├── 📂 routes/          # API 端点
│   ├── 📂 services/        # 核心服务（AI、提醒）
│   └── 📄 server.js        # Express 服务器
├── 📂 database/
│   ├── 📂 models/         # 数据模型（提示词等）
│   └── 📄 index.js        # 数据库设置
├── 📄 index.js            # 主程序入口
├── 📄 .env               # 环境变量
└── 📄 database.sqlite    # SQLite 数据库（自动创建）
```

## 🛠️ 技术栈

| 类别       | 技术               | 用途         |
| ---------- | ------------------ | ------------ |
| **机器人** | Discord.js         | Discord API  |
| **AI**     | Google Gemini 2.0  | 自然语言处理 |
| **数据库** | SQLite + Sequelize | 数据存储     |
| **管理**   | AdminJS            | 网页管理界面 |
| **定时**   | node-cron          | 提醒系统     |
| **服务器** | Express.js         | 网页服务     |

## 🔧 常见问题

### 问题排查

**机器人不回复：**
- ✅ 检查 Discord 机器人权限（包括斜杠命令）
- ✅ 确认 `.env` 文件中的 `DISCORD_TOKEN` 正确
- ✅ 确保在消息中@了机器人（如果设置了只在被@时回复）
- ✅ 检查控制台连接错误日志

**AI 回复失败：**
- ✅ 确认 `GEMINI_API_KEY` 有效且激活
- ✅ 检查 API 配额限制和计费状态
- ✅ 查看控制台具体错误日志

**管理面板打不开：**
- ✅ 确保 3000 端口可用
- ✅ 确认机器人正在运行（`npm start`）
- ✅ 访问 `http://localhost:3000/admin`
- ✅ 检查防火墙设置

**提醒功能不工作：**
- ✅ 使用 `/remind time:HHMM message:提醒内容` 格式（例如：`/remind time:1430 message:开会`）
- ✅ 时间格式为 HHMM（无冒号）：0900, 1430, 2000
- ✅ 检查控制台定时任务日志
- ✅ 确认机器人有发送消息权限
- ✅ 使用 `/reminders` 查看活跃提醒

**数据库问题：**
- ✅ 默认提示词仅在首次运行时（空数据库）创建
- ✅ 删除 `database.sqlite` 可重置所有数据
- ✅ 检查数据库创建的文件权限

### 调试模式

启用详细日志：
```bash
DEBUG=* npm start
```

## 📄 许可证

ISC 许可证 - 可自由使用和修改！

---

**用 ❤️ 为 Discord 社区制作**