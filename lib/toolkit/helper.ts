/** @format */

import { SlashCommandBuilder } from "discord.js";
import { ISlashCommand } from "../types";

export function createSlashCommand(commandInterface: ISlashCommand) {
  const { data, execute } = commandInterface;

  if (!data) {
    throw new Error("Missing data field");
  }

  if (typeof execute !== "function") {
    throw new Error("Execute must be a function for slash command");
  }

  return commandInterface;
}
