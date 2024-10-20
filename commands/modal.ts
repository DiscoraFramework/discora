/** @format */

import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
} from "discord.js";


import { createSlashCommand } from "../lib";

// Modal handler
export const handleModalSubmit = async (interaction: ModalSubmitInteraction) => {
  // Retrieve the text input value from the modal
  
  const textInputValue = interaction.fields.getTextInputValue("test-input");

  console.log("Text input received:", textInputValue);

  // Handle the modal submission response
  if (textInputValue) {
    await interaction.reply(`You submitted: ${textInputValue}`);
  } else {
    await interaction.reply("Submission is empty or missing.");
  }
};



// Command to show the modal
export default createSlashCommand({
  data: new SlashCommandBuilder()
    .setName("testmodal")
    .setDescription("Shows a test modal for user input"),

  async execute(interaction) {
    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("testmodal-testmodal")
      .setTitle("Test Modal");

    // Create a text input for the modal
    const textInput = new TextInputBuilder()
      .setCustomId("test-input")
      .setLabel("Enter some text")
      .setStyle(TextInputStyle.Short);

    // Create an action row for the text input
    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
    modal.addComponents(actionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  },
});
