/** @format */

import { GatewayIntentBits } from "discord.js";
import { DiscoraClient } from "./lib/client";
import dotenv from "dotenv";

dotenv.config();

const client = new DiscoraClient({
  root: process.cwd(),
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
  commandsFolders: { slash: "/commands" },
});

client.loadCommands();

client.on("ready", function (e) {
  console.log(`bot is ready ${e.user.username}`);
});

client.login(process.env.TOKEN);
