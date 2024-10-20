/** @format */
import {
  Events,
  ClientEvents,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { DiscoraClient } from "./client";

export interface ISlashCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => any;
  handlers?: {
    handleButtonClick?: (...args: any) => any;
    handleAutoComplete?: (...args: any) => any;
    handleModalSubmit?: (...args: any) => any; // Handlers can be of any interaction type
  };
}

export interface IEvent<K extends keyof ClientEvents> {
  name: K;
  once?: boolean;
  handler: (client: DiscoraClient, ...args: ClientEvents[K]) => void;
}
