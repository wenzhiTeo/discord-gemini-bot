// src/commands/index.js
import { pingCommand } from './ping.js';
import { remindCommand } from './remind.js';
import { helpCommand } from './help.js';
import { remindersCommand } from './reminders.js';
import { clearRemindersCommand } from './clear-reminders.js';

export const commands = [
    pingCommand,
    remindCommand,
    helpCommand,
    remindersCommand,
    clearRemindersCommand
];

export const commandMap = new Map(
    commands.map(cmd => [cmd.data.name, cmd])
);