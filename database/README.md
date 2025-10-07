# Database Structure

Simple SQLite database setup for the Discord Gemini Bot.

## Files

- `index.js` - Main database initialization and model exports
- `models/prompt.js` - Prompt model with validation and hooks

## Models

### Prompt
- `id` - Primary key
- `title` - Prompt title (max 255 chars)
- `content` - Prompt content (max 10000 chars)
- `is_active` - Boolean flag for active prompt
- `created_by` - User ID who created the prompt
- `usage_count` - Number of times used
- `created_at` / `updated_at` - Timestamps

## Usage

```javascript
import { Prompt, initializeDatabase } from './database/index.js';

// Initialize database
await initializeDatabase();

// Get active prompt
const activePrompt = await Prompt.getActive();

// Create new prompt
const newPrompt = await Prompt.create({
    title: "My Prompt",
    content: "Prompt content here"
});

// Activate a prompt
await newPrompt.activate();
```

## Default Data

The database automatically seeds with:
1. "小云雀来海 个性" - Custom personality prompt (active by default)
2. "专业助手" - Professional assistant prompt (inactive)

## API Endpoints

- `GET /ai-api/status` - Database and service health
- `GET /ai-api/activePrompt` - Get current active prompt
- `POST /ai-api/reloadPrompt` - Reload Gemini with current prompt