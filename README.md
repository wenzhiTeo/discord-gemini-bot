# Discord AI Bot

A Discord bot powered by Google Gemini AI with intelligent conversation, scheduled reminders, and web-based admin panel.

## 🎯 Key Features

- **🤖 AI Chat**: Natural conversations using Google Gemini 2.0
- **📷 Image Analysis**: Upload images for AI-powered analysis
- **⏰ Scheduled Reminders**: Set timed messages that auto-send
- **🛠️ Web Management**: Browser-based bot configuration

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- Discord Bot Token: [Get one here](https://discord.com/developers/applications)
- Google Gemini API Key: [Get one here](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd discord-gemini-bot
   npm install
   ```

2. **Environment Setup**
   Create `.env` file:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   GEMINI_API_KEY=your_gemini_api_key
   INIT_CHANNEL_ID=startup_notification_channel_id_optional
   BLACKLISTED_CHANNEL_IDS=channel1,channel2,channel3_optional
   ```

3. **Discord Bot Permissions**
   
   In Discord Developer Portal, ensure your bot has:
   - Send Messages
   - Read Message History
   - Use Slash Commands
   - Mention Everyone
   - Attach Files
   
   Enable these intents:
   - Message Content Intent
   - Guild Members Intent

4. **Start the Bot**
   ```bash
   npm start
   ```
   
   Admin panel: `http://localhost:3000/admin`

## 📖 Usage

### Basic Commands

#### 💬 Chat with AI
```
@YourBot Hello! How are you today?
@YourBot [upload image] What do you see in this picture?
```

#### 🔧 Slash Commands
```
/help                    # Show available commands
/设置定时提醒             # Set up scheduled reminders
```

#### ⏰ Set Reminders
Use the `/设置定时提醒` command, then reply with:
```
14:30 Team meeting reminder
09:00 Take medication
20:00 Call mom
```

### Admin Panel

Visit `http://localhost:3000/admin` to:

- **📝 Manage Prompts**: Create and edit AI personality styles
- **🔄 Live Updates**: Prompt changes reload AI service automatically
- **📊 Usage Statistics**: View prompt usage counts and activity
- **⚙️ Database Management**: Browse and manage all stored data

### Running Options

```bash
# Start bot with admin panel (recommended)
npm start
```

## ⚙️ Configuration

### Environment Variables

| Variable                  | Description                        | Required | Example              |
| ------------------------- | ---------------------------------- | -------- | -------------------- |
| `DISCORD_TOKEN`           | Discord bot token                  | ✅        | `MTIzNDU2Nzg5...`    |
| `GEMINI_API_KEY`          | Google Gemini API key              | ✅        | `AIzaSyC...`         |
| `INIT_CHANNEL_ID`         | Startup notification channel       | ❌        | `123456789012345678` |
| `BLACKLISTED_CHANNEL_IDS` | Ignored channels (comma-separated) | ❌        | `123,456,789`        |

### Advanced Settings

Edit `src/config/index.js`:

```javascript
{
  MODEL_NAME: "gemini-2.0-flash",        // AI model version
  MAX_MESSAGE_LENGTH: 2000,              // Discord message limit
  IS_MENTION_ONLY: true,                 // Require @mention to respond
  MAX_HISTORY_LENGTH: 20                 // Chat context length
}
```

## 📁 Project Structure

```
discord-gemini-bot/
├── 📂 src/
│   ├── 📂 commands/        # Discord slash commands
│   ├── 📂 config/          # Bot configuration
│   ├── 📂 handlers/        # Message & command processing
│   ├── 📂 routes/          # API endpoints
│   ├── 📂 services/        # Core services (AI, reminders)
│   └── 📄 server.js        # Express server
├── 📂 database/
│   ├── 📂 models/         # Data models (prompts, etc.)
│   └── 📄 index.js        # Database setup
├── 📄 index.js            # Main application entry
├── 📄 .env               # Environment variables
└── 📄 database.sqlite    # SQLite database (auto-created)
```

## 🛠️ Tech Stack

| Category      | Technology         | Purpose                     |
| ------------- | ------------------ | --------------------------- |
| **Bot**       | Discord.js         | Discord API integration     |
| **AI**        | Google Gemini 2.0  | Natural language processing |
| **Database**  | SQLite + Sequelize | Data storage                |
| **Admin**     | AdminJS            | Web management interface    |
| **Scheduler** | node-cron          | Reminder system             |
| **Server**    | Express.js         | Web service                 |

## 🔧 Troubleshooting

### Common Issues

**Bot not responding:**
- ✅ Check Discord bot permissions (including slash commands)
- ✅ Verify `DISCORD_TOKEN` in `.env` file
- ✅ Ensure bot is mentioned in message (if mention-only mode enabled)
- ✅ Check console logs for connection errors

**AI responses failing:**
- ✅ Verify `GEMINI_API_KEY` is valid and active
- ✅ Check API quota limits and billing
- ✅ Review console error logs for specific errors

**Admin panel not loading:**
- ✅ Ensure port 3000 is available
- ✅ Confirm bot is running (`npm start`)
- ✅ Visit `http://localhost:3000/admin`
- ✅ Check firewall settings

**Reminders not working:**
- ✅ Use `/设置定时提醒` slash command first
- ✅ Use correct format: `HH:mm reminder text`
- ✅ Check console for cron job logs
- ✅ Verify bot has send message permissions

**Database issues:**
- ✅ Default prompts seed only on first run (empty database)
- ✅ Delete `database.sqlite` to reset all data
- ✅ Check file permissions for database creation

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npm start
```

## 📄 License

ISC License - Feel free to use and modify!

## 🌐 Language Support

- **English**: README.md (this file)
- **中文**: [README-zh.md](README-zh.md)

---

**Made with ❤️ for Discord communities**