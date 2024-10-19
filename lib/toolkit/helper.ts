/** @format */

import { Events, ClientEvents, SlashCommandBuilder } from "discord.js";
import { IEvent, ISlashCommand } from "../types";

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

export function createEvent<K extends keyof ClientEvents>(eventInterface: IEvent<K>) {
  const { name, handler } = eventInterface;

  // Validate that the event name is a valid Discord.js event
  if (!name) {
    throw new Error(`Invalid event name: ${name}`);
  }

  // Ensure the handler is a valid function
  if (typeof handler !== "function") {
    throw new Error(`The handler for event "${name}" must be a function`);
  }

  // Event registration logic (you could add more logic here if needed)
  return eventInterface;
}
