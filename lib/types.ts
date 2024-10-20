/** @format */
import {
  Events,
  ClientEvents,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  ButtonInteraction,
  AutocompleteInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import { DiscoraClient } from "./client";

export type HandleButtonClickFunction = (interaction: ButtonInteraction) => any;

export type HandleAutoCompleteFunction = (interaction: AutocompleteInteraction) => any;

export type HandleModalSubmitFunction = (interaction: ModalSubmitInteraction) => any;


export interface ISlashCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => any;
  handlers?: {
    handleButtonClick?: HandleButtonClickFunction;
    handleAutoComplete?: HandleAutoCompleteFunction;
    handleModalSubmit?: HandleModalSubmitFunction; // Handlers can be of any interaction type
  };
}

export interface IEvent<K extends keyof ClientEvents> {
  name: K;
  once?: boolean;
  handler: (client: DiscoraClient, ...args: ClientEvents[K]) => any;
}
