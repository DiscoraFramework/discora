/** @format */

import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
} from "discord.js";

import { createSlashCommand } from "../lib";


export const buttonHandler = async (interaction: ButtonInteraction) => {
  if (interaction.customId === "ping-hello_button") {
    return await interaction.reply("hello world");
  }

  if (interaction.customId === "ping-hi_button") {
    return await interaction.reply("hi");
  }
};





//etc
export default createSlashCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("test command"),

  async execute(interaction) {
    const sayHelloButton = new ButtonBuilder()
      .setCustomId("ping-hello_button")
      .setLabel("say hello")
      .setStyle(ButtonStyle.Primary);

    const sayHiButton = new ButtonBuilder()
      .setCustomId("ping-hi_button")
      .setLabel("say hi")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      sayHelloButton,
      sayHiButton
    );

    await interaction.reply({
      content: "How do you want me to respond",
      components: [row],
    });
  },
});
