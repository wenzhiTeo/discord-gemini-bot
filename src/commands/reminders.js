// src/commands/reminders.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const remindersCommand = {
    data: new SlashCommandBuilder()
        .setName('reminders')
        .setDescription('List all your active reminders'),

    async execute(interaction, services) {
        try {
            const userReminders = services.reminderService.getUserReminders(interaction.user.id);

            if (userReminders.length === 0) {
                await interaction.reply({
                    content: '📭 You have no active reminders.',
                    ephemeral: true
                });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle('⏰ Your Active Reminders')
                .setDescription(`You have ${userReminders.length} active reminder(s):`)
                .setTimestamp();

            userReminders.forEach((reminder, index) => {
                const hours = parseInt(reminder.time.slice(0, -2));
                const minutes = parseInt(reminder.time.slice(-2));
                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                embed.addFields({
                    name: `${index + 1}. ${formattedTime}`,
                    value: `📝 ${reminder.text}\n📅 Created: ${reminder.createdAt.toLocaleString()}`,
                    inline: false
                });
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error in reminders command:', error);
            await interaction.reply({
                content: '❌ An error occurred while fetching your reminders.',
                ephemeral: true
            });
        }
    }
};