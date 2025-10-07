/*
  Discord Interactions Endpoint
  Use this if Interactions Endpoint URL is set in Discord Developer Portal
*/

import express from "express";
import {
    verifyKeyMiddleware,
    InteractionType,
    InteractionResponseType,
} from "discord-interactions";
import config from "../config/index.js";

const DISCORD_PUBLIC_KEY = config.DISCORD_PUBLIC_KEY;
const router = express.Router();

// Map command names to handler functions
const commandHandlers = {
    ping: async () => ({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "🏓 Pong! via webhook" },
    }),
    // Add more commands here, e.g.:
    // hello: async (interaction) => ({ ... })
};

// Interaction POST endpoint
router.post(
    "/interactions",
    express.raw({ type: "application/json" }),
    verifyKeyMiddleware(DISCORD_PUBLIC_KEY),
    async (req, res) => {
        try {
            const interaction = req.body;

            // Respond to Discord PING for verification
            if (interaction.type === InteractionType.PING) {
                return res.status(200).send({ type: InteractionResponseType.PONG });
            }

            // Handle application commands
            if (interaction.type === InteractionType.APPLICATION_COMMAND) {
                const commandName = interaction.data?.name;

                if (commandName && commandHandlers[commandName]) {
                    const response = await commandHandlers[commandName](interaction);
                    return res.status(200).send(response);
                }

                // Unknown command
                return res.status(200).send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: `❌ Unknown command: ${commandName}` },
                });
            }

            // Other interaction types are not supported
            return res.status(400).end();
        } catch (err) {
            console.error("Error handling interaction:", err);
            return res.status(500).end();
        }
    }
);

export default router;
