# Discord Gemini Bot

A Discord bot powered by Google's Gemini AI that provides intelligent conversation, reminder functionality, and an admin panel for template management.

## Features

### 🤖 AI Chat Integration
- **Gemini AI**: Powered by Google's Gemini 2.0 Flash model
- **Mention-based responses**: Bot responds only when mentioned in channels (configurable)
- **Image support**: Can analyze and respond to images sent in Discord
- **Personality**: Cute and helpful character "小云雀来海" with Japanese-style expressions
- **Message splitting**: Automatically handles long responses by splitting them
- **Template system**: Admin-configurable AI prompt templates stored in database

### ⏰ Reminder System
- **Single command**: Only `$设置定时提醒` command (no slash commands)
- **Template-based setup**: Reply to bot's template message with `HH:mm reminder text`
- **Automatic notifications**: Cron job checks and sends reminders every minute
- **User mentions**: Reminds specific users in their original channel
- **In-memory storage**: Reminders are stored in memory (reset on bot restart)

### 🛠️ Admin Panel
- **Web interface**: AdminJS-powered admin panel at `http://localhost:3000/admin`
- **Template management**: Create and manage AI prompt templates
- **Database operations**: Full CRUD operations for templates
- **Sample data**: Includes pre-configured templates like "默认对话", "杂费计算", "天气查询"
- **Real-time updates**: Template changes affect bot behavior immediately

### 🗄️ Database & Utilities
- **SQLite**: Lightweight database storage (`bot.db`)
- **Template system**: Store and manage AI prompt templates with activation status
- **Auto-initialization**: Database setup with sample data on first run
- **Direct messaging**: Utility for sending messages to channels, users, or guilds
- **Startup notifications**: Bot announces when online to configured channel

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Discord Bot Token
- Google Gemini API Key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd discord-gemini-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   GEMINI_API_KEY=your_gemini_api_key
   INIT_CHANNEL_ID=channel_id_for_startup_messages
   BLACKLISTED_CHANNEL_IDS=channel1,channel2,channel3
   ```

4. **Discord Bot Setup**
   - Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a bot and copy the token
   - Enable the following bot permissions:
     - Send Messages
     - Read Message History
     - Mention Everyone
     - Attach Files (for image analysis)
   - Enable the following privileged gateway intents:
     - Message Content Intent
     - Guild Members Intent

5. **Google Gemini API**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add it to your `.env` file

## Usage

### Running the Bot

**Development mode** (runs both bot and admin panel):
```bash
npm run dev
```

**Production mode** (bot only):
```bash
npm start
```

**Admin panel only**:
```bash
npm run admin
```

### Bot Commands

#### Reminders
The bot supports a single text command for setting reminders:

1. **Set Reminder**: Send `$设置定时提醒` in any channel
2. **Configure**: Reply to the bot's template message with format: `HH:mm Your reminder text`
3. **Example**: `14:30 Meeting with team`

#### AI Chat
- **Mention-based**: Mention the bot in any message: `@YourBot Hello, how are you?`
- **Image analysis**: Send images with text for AI to analyze and respond
- **Personality**: Bot responds with a cute, helpful personality using Japanese-style expressions
- **Auto-split**: Long responses are automatically split into multiple messages

### Admin Panel

Access the admin panel at `http://localhost:3000/admin` to:
- Create new AI prompt templates
- Edit existing templates
- Enable/disable templates
- View template usage statistics

## Configuration

### Environment Variables

| Variable                  | Description                           | Required |
| ------------------------- | ------------------------------------- | -------- |
| `DISCORD_TOKEN`           | Discord bot token                     | Yes      |
| `GEMINI_API_KEY`          | Google Gemini API key                 | Yes      |
| `INIT_CHANNEL_ID`         | Channel for startup notifications     | No       |
| `BLACKLISTED_CHANNEL_IDS` | Comma-separated channel IDs to ignore | No       |

### Bot Configuration

Edit `src/config/index.js` to modify:
- `MODEL_NAME`: Gemini model version
- `MAX_MESSAGE_LENGTH`: Discord message length limit
- `IS_MENTION_ONLY`: Require mentions to respond
- `MAX_HISTORY_LENGTH`: Chat history length

## Project Structure

```
discord-gemini-bot/
├── src/
│   ├── config/           # Configuration files
│   ├── handlers/         # Message handling logic
│   ├── services/         # Core services (AI, messaging, reminders)
│   └── utils/           # Utility functions
├── database/
│   ├── models/          # Database models
│   └── initDb.js        # Database initialization
├── admin.js             # Admin panel server
├── index.js             # Main bot entry point
└── package.json         # Dependencies and scripts
```

## Dependencies

### Core
- `discord.js` - Discord API wrapper
- `@google/generative-ai` - Google Gemini AI integration
- `sequelize` - Database ORM
- `sqlite3` - SQLite database driver

### Admin Panel
- `adminjs` - Admin interface framework
- `@adminjs/express` - Express.js integration
- `@adminjs/sequelize` - Sequelize adapter

### Utilities
- `node-cron` - Task scheduling
- `dotenv` - Environment variable management
- `express` - Web server framework

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Support

For issues and questions:
1. Check the console logs for error messages
2. Verify your environment variables are set correctly
3. Ensure your Discord bot has the required permissions
4. Check that your Gemini API key is valid and has quota remaining