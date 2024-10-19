/** @format */

import { Events } from "discord.js";
import { createEvent } from "../lib";

export default createEvent({
  name: Events.InteractionCreate,
  async handler(client, interaction) {
    console.log(interaction);
    if (interaction.isChatInputCommand()) {
      await client.handleChatInputCommand(interaction);
    }
  },
});
