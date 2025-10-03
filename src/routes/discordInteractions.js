import express from "express";
import {
    verifyKeyMiddleware,
    InteractionType,
    InteractionResponseType,
} from "discord-interactions";
import config from "../config/index.js";

const DISCORD_PUBLIC_KEY = config.DISCORD_PUBLIC_KEY;

const router = express.Router();

// 注意：这个路由不要用 bodyParser.json()
// 因为 verifyKeyMiddleware 需要原始 body
router.post(
    "/interactions",
    verifyKeyMiddleware(DISCORD_PUBLIC_KEY),
    (req, res) => {
        const interaction = req.body;

        if (interaction.type === InteractionType.PING) {
            return res.send({ type: InteractionResponseType.PONG });
        }

        if (interaction.type === InteractionType.APPLICATION_COMMAND) {
            const { name } = interaction.data;

            if (name === "hello") {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `Hello, ${interaction.member?.user.username || "there"}!`,
                    },
                });
            }
        }

        return res.sendStatus(400);
    }
);

export default router;
