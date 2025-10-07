import { Routes, REST } from 'discord.js';
import { commands, commandMap } from '../commands/index.js';

class CommandHandler {
    constructor(client, token) {
        this.client = client;
        this.rest = new REST({ version: '10' }).setToken(token);
        this.commands = commandMap;
        this.cooldowns = new Map();
    }

    async registerCommands() {
        try {
            console.log('🚀 Registering commands...');

            const commandData = commands.map(command => command.data.toJSON());
            await this.rest.put(
                Routes.applicationCommands(this.client.user.id),
                { body: commandData }
            );

            console.log(`✅ Registered ${commandData.length} commands`);
        } catch (error) {
            console.error('❌ Command registration failed:', error);
            throw error;
        }
    }

    checkCooldown(userId, commandName, cooldownSeconds = 3) {
        if (!this.cooldowns.has(commandName)) {
            this.cooldowns.set(commandName, new Map());
        }

        const now = Date.now();
        const timestamps = this.cooldowns.get(commandName);
        const cooldownAmount = cooldownSeconds * 1000;

        if (timestamps.has(userId)) {
            const expirationTime = timestamps.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                return Math.ceil((expirationTime - now) / 1000);
            }
        }

        timestamps.set(userId, now);
        setTimeout(() => timestamps.delete(userId), cooldownAmount);
        return null;
    }

    setupListeners(services) {
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            const command = this.commands.get(interaction.commandName);
            if (!command) return;

            // Check cooldown
            const cooldownLeft = this.checkCooldown(interaction.user.id, interaction.commandName);
            if (cooldownLeft) {
                await interaction.reply({
                    content: `⏱️ Please wait ${cooldownLeft} seconds`,
                    ephemeral: true
                });
                return;
            }

            try {
                await command.execute(interaction, services);
            } catch (error) {
                console.error(`❌ Command ${interaction.commandName} failed:`, error);

                const errorMessage = { content: '❌ Command failed!', ephemeral: true };
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        });
    }
}

export default CommandHandler;