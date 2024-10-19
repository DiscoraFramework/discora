/** @format */

import { AutocompleteInteraction, ModalSubmitInteraction, SlashCommandBuilder } from "discord.js";
import { createSlashCommand } from "../lib";

export const autoCompleteHandler = async (interaction: AutocompleteInteraction) => {
  const focusedOption = interaction.options.getFocused(true);

  console.log(focusedOption);

  const choices = [
    "Popular Topics: Threads",
    "Sharding: Getting started",
    "Library: Voice Connections",
    "Interactions: Replying to slash commands",
    "Popular Topics: Embed preview",
  ];

  // Case-insensitive filtering
  const filtered = choices.filter((choice) =>
    choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
  );

  await interaction.respond(
    filtered.map((choice) => ({
      name: choice, // Keep original case in name
      value: choice.toLocaleLowerCase(), // Convert value to lower case
    }))
  );
};


export default createSlashCommand({
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test autocomplete handler")
    .addStringOption((option) =>
      option
        .setName("complete")
        .setDescription("type to get auto complete")
        .setAutocomplete(true)
    ),

  // handlers can also be defined here however ones out side the defualt export takes persdence
  handlers: {},

  async execute(interaction) {
    const value = interaction.options.getString("complete");
    await interaction.reply(`you chose this ${value}`);
  },
});
