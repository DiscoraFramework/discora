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
    [key: string]: (interaction: any) => any; // Handlers can be of any interaction type
  };
}

export interface IEvent<K extends keyof ClientEvents> {
  name: K;
  once?: boolean;
  handler: (client: DiscoraClient, ...args: ClientEvents[K]) => void;
}
