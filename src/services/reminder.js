const reminders = [];
const templateMessageIds = new Set();

export async function handleSetReminderCommand(message) {
  const sent = await message.reply("⏰ 模版：请回复此消息，格式为 `HH:mm 你的提醒内容`");
  templateMessageIds.add(sent.id);
}

export async function handleTemplateReply(message) {
  if (!message.reference?.messageId) return false;
  if (!templateMessageIds.has(message.reference.messageId)) return false;

  const [timePart, ...rest] = message.content.split(" ");
  const reminderText = rest.join(" ");

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(timePart)) {
    await message.reply("⚠️ 时间格式错误，请使用 `HH:mm 提醒内容` 格式");
    return true;
  }

  reminders.push({
    userId: message.author.id,
    channelId: message.channel.id,
    time: timePart,
    text: reminderText,
  });

  await message.reply(`✅ 已添加提醒：${timePart} - ${reminderText}`);
  return true;
}

export function checkReminders(client) {
  const now = new Date();
  const current = now.toTimeString().slice(0, 5);

  reminders.forEach((reminder) => {
    if (reminder.time === current) {
      const channel = client.channels.cache.get(reminder.channelId);
      if (channel) {
        channel.send(`<@${reminder.userId}> ⏰ 提醒：${reminder.text}`);
      }
    }
  });
}
