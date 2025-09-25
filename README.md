# 🤖 Discord Gemini Bot

一个基于 Discord.js 和 Google Gemini AI 的智能机器人，使用 AdminJS + Sequelize 提供现代化的管理面板。

## 🚀 功能特性

- 🤖 智能对话（基于 Google Gemini AI）
- ⚡ 自定义命令系统
- 📊 用户活动统计和日志记录
- 🎛️ AdminJS 现代化管理面板
- 💾 Sequelize ORM + SQLite 数据库

## 📦 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
确保 `.env` 文件包含以下配置：
```env
DISCORD_TOKEN=your-discord-bot-token
GEMINI_API_KEY=your-google-gemini-api-key
PRIVATE_CHANNEL_ID=your-private-channel-id
ADMIN_PORT=3001
```

### 3. 启动服务

#### 启动机器人
```bash
npm start
```

#### 启动管理面板
```bash
npm run admin
```

#### 同时启动（开发模式）
```bash
npm run dev
```

### 4. 访问管理面板
打开浏览器访问：`http://localhost:3001/admin`

## 🎛️ AdminJS 管理面板

现代化的管理界面，支持：
- **Commands**: 管理机器人命令
- **Users**: 查看用户信息和统计
- **Logs**: 查看详细的交互日志

## ⚡ 命令系统

用户可以通过 `$命令名称` 的格式触发自定义命令：
- `$计算本月杂费` - 显示杂费计算模板
- `$天气查询` - 显示天气查询提示

## 💾 数据库结构

使用 Sequelize ORM 管理 SQLite 数据库：
- `commands`: 存储自定义命令
- `users`: 存储用户信息和统计
- `logs`: 存储操作日志

## 📌 系统要求
- Node.js **18+** (推荐 Node 20)
- Discord Bot Token
- Google Gemini API Key