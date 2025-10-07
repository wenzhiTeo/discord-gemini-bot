// src/services/reminder.js
export class ReminderService {
  constructor(client) {
    this.reminders = [];
    this.client = client;
  }

  async handleInteraction(interaction) {
    const timeStr = interaction.options.getString('time');
    const message = interaction.options.getString('message');

    // Validate time format (3-4 digits)
    if (!/^\d{3,4}$/.test(timeStr)) {
      await interaction.reply({
        content: '⚠️ Invalid time format. Please use HHMM format (e.g., 1430 for 2:30 PM)',
        ephemeral: true
      });
      return;
    }

    // Parse time
    const hours = parseInt(timeStr.slice(0, -2));
    const minutes = parseInt(timeStr.slice(-2));

    // Validate time values
    if (hours > 23 || minutes > 59) {
      await interaction.reply({
        content: '⚠️ Invalid time. Hours must be 0-23 and minutes must be 0-59',
        ephemeral: true
      });
      return;
    }

    const reminder = {
      userId: interaction.user.id,
      channelId: interaction.channel.id,
      time: timeStr,
      text: message,
      createdAt: new Date(),
      username: interaction.user.username
    };

    this.reminders.push(reminder);

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    await interaction.reply({
      content: `⏰ Reminder set for **${formattedTime}**\n📝 Message: "${message}"`,
      ephemeral: false
    });
  }

  checkReminders() {
    const now = new Date();
    const current = now.toTimeString().slice(0, 5);

    // Filter out triggered reminders
    this.reminders = this.reminders.filter((reminder) => {
      const reminderTime =
        reminder.time.length === 3
          ? `0${reminder.time.slice(0, 1)}:${reminder.time.slice(1)}`
          : `${reminder.time.slice(0, 2)}:${reminder.time.slice(2)}`;

      if (reminderTime === current) {
        const channel = this.client.channels.cache.get(reminder.channelId);
        if (channel) {
          channel.send(`<@${reminder.userId}> ⏰ 提醒：${reminder.text}`);
        }
        return false; // Remove this reminder
      }
      return true; // Keep this reminder
    });
  }

  // Get all active reminders for a user
  getUserReminders(userId) {
    return this.reminders.filter(r => r.userId === userId);
  }

  // Remove a specific reminder
  removeReminder(userId, index) {
    const userReminders = this.getUserReminders(userId);
    if (userReminders[index]) {
      const reminderIndex = this.reminders.indexOf(userReminders[index]);
      this.reminders.splice(reminderIndex, 1);
      return true;
    }
    return false;
  }

  // Clear all reminders for a user
  clearUserReminders(userId) {
    const initialLength = this.reminders.length;
    this.reminders = this.reminders.filter(r => r.userId !== userId);
    return initialLength - this.reminders.length;
  }
}
