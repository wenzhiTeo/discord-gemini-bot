# Discord Gemini Bot

A powerful Discord bot powered by Google's Gemini AI with intelligent conversation, reminder system, and web-based admin panel for easy management.

## ✨ Features

### 🤖 AI Chat Integration
- **Google Gemini 2.0 Flash**: Advanced AI model for natural conversations
- **Smart Responses**: Responds only when mentioned (configurable)
- **Image Analysis**: Upload images and get AI-powered analysis
- **Dynamic Prompts**: Customizable AI personality through admin panel
- **Auto Message Splitting**: Handles long responses automatically
- **Real-time Updates**: Prompt changes take effect immediately

### ⏰ Smart Reminders
- **Simple Setup**: Use `$设置定时提醒` command
- **Easy Format**: Reply with `HH:mm Your reminder text`
- **Auto Notifications**: Cron-based scheduling (every minute check)
- **User Targeting**: Mentions specific users in original channels
- **Example**: `14:30 Team meeting in conference room`

### 🛠️ Admin Dashboard
- **Web Interface**: Clean AdminJS panel at `http://localhost:3000/admin`
- **Prompt Management**: Create, edit, and activate AI templates
- **Live Preview**: Test prompts before activation
- **Database Operations**: Full CRUD with SQLite backend
- **Event System**: Automatic bot reload when prompts change

### 🔧 Technical Features
- **SQLite Database**: Lightweight, file-based storage
- **Event-Driven**: Real-time communication between admin panel and bot
- **Channel Blacklisting**: Exclude specific channels from bot responses
- **Startup Notifications**: Configurable bot online announcements
- **Error Handling**: Graceful fallbacks and user-friendly error messages

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ 
- **Discord Bot Token** ([Get one here](https://discord.com/developers/applications))
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone & Install**
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
   INIT_CHANNEL_ID=channel_id_for_startup_messages
   BLACKLISTED_CHANNEL_IDS=channel1,channel2,channel3
   ```

3. **Discord Bot Configuration**
   
   **Required Permissions:**
   - Send Messages
   - Read Message History  
   - Mention Everyone
   - Attach Files
   
   **Required Intents:**
   - Message Content Intent
   - Guild Members Intent

4. **Start the Bot**
   ```bash
   npm start
   ```
   
   Access admin panel: `http://localhost:3000/admin`

## 📖 Usage Guide

### Commands

#### 💬 Chat with AI
```
@YourBot Hello! How are you today?
@YourBot [attach image] What do you see in this picture?
```

#### ⏰ Set Reminders
```
$设置定时提醒
```
Then reply to bot's message with:
```
14:30 Team meeting in conference room
09:00 Take morning medication
20:00 Call mom for her birthday
```

### Admin Panel Features

Visit `http://localhost:3000/admin` to:

- **📝 Manage Prompts**: Create and edit AI personality templates
- **🔄 Live Updates**: Changes apply instantly to the bot
- **📊 Database View**: Browse all stored data
- **⚙️ Configuration**: Manage bot behavior settings

### Running Options

```bash
# Start bot with admin panel (recommended)
npm start

# Development mode with auto-restart
npm run dev
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
│   ├── 📂 config/          # Bot configuration
│   ├── 📂 handlers/        # Message processing
│   ├── 📂 services/        # Core services (AI, reminders)
│   └── 📂 utils/          # Helper functions
├── 📂 database/
│   ├── 📂 models/         # Data models (Prompt)
│   └── 📄 index.js        # Database setup
├── 📄 index.js            # Main application
├── 📄 .env               # Environment variables
└── 📄 database.sqlite    # SQLite database
```

## 🛠️ Tech Stack

| Category          | Technology         | Purpose                     |
| ----------------- | ------------------ | --------------------------- |
| **Bot Framework** | Discord.js         | Discord API integration     |
| **AI Engine**     | Google Gemini 2.0  | Natural language processing |
| **Database**      | SQLite + Sequelize | Data persistence & ORM      |
| **Admin Panel**   | AdminJS            | Web-based management        |
| **Scheduling**    | node-cron          | Reminder system             |
| **Web Server**    | Express.js         | Admin panel hosting         |

## 🔧 Troubleshooting

### Common Issues

**Bot not responding:**
- ✅ Check Discord bot permissions
- ✅ Verify `DISCORD_TOKEN` in `.env`
- ✅ Ensure bot is mentioned in message (if `IS_MENTION_ONLY: true`)

**AI responses failing:**
- ✅ Verify `GEMINI_API_KEY` is valid
- ✅ Check API quota limits
- ✅ Review console logs for errors

**Admin panel not loading:**
- ✅ Ensure port 3000 is available
- ✅ Check if bot is running (`npm start`)
- ✅ Visit `http://localhost:3000/admin`

**Reminders not working:**
- ✅ Use exact format: `HH:mm reminder text`
- ✅ Check console for cron job logs
- ✅ Verify bot has send message permissions

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npm start
```

## 📄 License

ISC License - Feel free to use and modify!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Made with ❤️ for Discord communities**