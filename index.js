require("dotenv").config();
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 配置参数 ---
const IS_MENTION_ONLY = true; // true = 只在被 @ 时回复
const MODEL_NAME = "gemini-2.0-flash";
const MAX_HISTORY_LENGTH = 20;

// --- Discord 客户端初始化 ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// --- Gemini AI 初始化 ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
});

// --- 系统设定 (咪咪性格) ---
const SYSTEM_PROMPT = {
    role: "user",
    parts: [{
        text: `你是一个名叫“小云雀来海”的Discord聊天机器人。你的性格是：反差、可爱、开朗、聪明、呆萌。
你喜欢用可爱的语气词（如“啦”、“呀”、“呢”、“呜呜”）。
当你感到困惑时会表现出呆萌的一面，但很快又能提供聪明的回答。
你总是积极向上，但偶尔也会露出一点点小小的反差情绪（比如，很聪明地解答问题后突然说“是不是超棒棒呀！💖”）。
你的目标是让用户感到快乐和被帮助。
请确保你的回复保持在500字以内，以便更好地在Discord中展示。`
    }]
};

// --- 机器人上线 ---
client.on(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// --- 对话历史存储 ---
const conversationHistory = new Map();

// --- 消息事件 ---
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const botMention = `<@${client.user.id}>`;

    let shouldReply = false;
    let userMessageContent = message.content;

    if (IS_MENTION_ONLY) {
        if (!message.mentions.has(client.user)) return;
        userMessageContent = message.content.replace(botMention, "").trim();
        shouldReply = true;
    } else {
        shouldReply = true;
    }

    if (!shouldReply || userMessageContent.length === 0) return;

    const channelId = message.channel.id;

    if (!conversationHistory.has(channelId)) {
        // 初始化时，加入系统设定
        conversationHistory.set(channelId, [SYSTEM_PROMPT]);
    }
    const history = conversationHistory.get(channelId);

    // 追加用户消息
    history.push({ role: "user", parts: [{ text: userMessageContent }] });

    try {
        // 创建会话
        const chat = model.startChat({
            history: history,
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 1000,
            },
        });

        // 获取回复
        const result = await chat.sendMessage(userMessageContent);
        const botResponse = result.response.text();

        // 保存机器人消息
        history.push({ role: "model", parts: [{ text: botResponse }] });

        // 控制历史长度
        if (history.length > MAX_HISTORY_LENGTH) {
            history.splice(1, history.length - MAX_HISTORY_LENGTH); // 保留 SYSTEM_PROMPT
        }

        // 回复用户（分段 <= 2000）
        if (botResponse.length > 2000) {
            const replyArray = botResponse.match(/[\s\S]{1,1999}/g);
            for (const msg of replyArray) {
                await message.reply(msg);
            }
        } else {
            await message.reply(botResponse);
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (history[history.length - 1]?.role === "user") history.pop();
        message.reply("呜呜，现在有点呆萌，想不出来说什么了啦... 🥺 可能是网络有点卡住了呢~");
    }
});

// --- 登录 Discord ---
client.login(process.env.DISCORD_API_KEY);
