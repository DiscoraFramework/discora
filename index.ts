/** @format */

import { GatewayIntentBits } from "discord.js";
import { DiscoraClient } from "./lib/client";
import dotenv from "dotenv";

dotenv.config();

const client = new DiscoraClient({
  token: process.env.TOKEN as string,
  clientId: "",
  guildId: "",
  root: process.cwd(),
  handler: { slash: "/" },
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
});

client.loadCommands();

client.loadEvents();

client.start();
