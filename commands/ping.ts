/** @format */

import { SlashCommandBuilder } from "discord.js";
import { createSlashCommand } from "../lib";



export default createSlashCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("test command"),
  async execute(interaction) {
    await interaction.reply("ping");
  },
});
