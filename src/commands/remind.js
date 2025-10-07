// src/commands/remind.js
import { SlashCommandBuilder } from 'discord.js';

export const remindCommand = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Set a reminder for a specific time')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time in HHMM format (e.g., 1430 for 2:30 PM)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Reminder message')
                .setRequired(true)
        ),

    async execute(interaction, services) {
        try {
            await services.reminderService.handleInteraction(interaction);
        } catch (error) {
            console.error('Error in remind command:', error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ An error occurred while setting your reminder. Please try again.',
                    ephemeral: true
                });
            }
        }
    }
};