/** @format */

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface ISlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => any;
}
