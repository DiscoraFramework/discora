/** @format */

import { GatewayIntentBits } from "discord.js";
import { DiscoraClient } from "./lib/client";
import dotenv from "dotenv";

dotenv.config();

const client = new DiscoraClient({
  token: process.env.TOKEN as string,
  clientId: process.env.CLIENT_ID as string,
  guildId: process.env.GUILD_ID as string,
  root: process.cwd(),
  handler: {
    slash: "/commands",
    events: "/events",
    message: "/message-command",
  },
  client: {
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
  },
});

client.start();


