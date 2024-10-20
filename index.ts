/** @format */

import { GatewayIntentBits } from "discord.js";
import { DiscoraClient } from "./lib/client";
import dotenv from "dotenv";

dotenv.config();

const client = new DiscoraClient({
  root: process.cwd(),
  token: process.env.TOKEN as string,
  clientId: process.env.CLIENT_ID as string,
  guildId: process.env.GUILD_ID as string,
  handler: {
    slash: "/commands",
    events: "/events",
  },
  loader: {
    events: "flat",
    slash: "recursive",
  },
  client: {
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
  },
});

client.start();

console.log(client.slashCommands);
