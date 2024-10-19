/** @format */

import { Events } from "discord.js";
import { createEvent } from "../lib";

export default createEvent({
  name: Events.InteractionCreate,
  async handler(client, interaction) {
    if (interaction.isChatInputCommand()) {
      await client.handleChatInput(interaction);
    } else if (interaction.isButton()) {
      await client.handleButton(interaction);
    } else if (interaction.isAutocomplete()) {
      await client.handleAutoComplete(interaction)
    }
  },
});
