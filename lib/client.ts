/** @format */

import { Client, ClientOptions, Collection } from "discord.js";
import { flatLoader, recursiveLoader } from "./loaders";
import { IEvent, ISlashCommand } from "./types";

type TLoaderEnum = "flat" | "recursive";

export interface loaderConfig {
  events: TLoaderEnum;
  message: TLoaderEnum;
  slash: TLoaderEnum;
}

export interface ClientHandler {
  slash: string;
  message: string;
  events: string;
}

export interface DiscoraClientOptions extends ClientOptions {
  root: string;
  token: string;
  clientId: string;
  guildId?: string;
  loader?: TLoaderEnum | loaderConfig;
  handler?: Partial<ClientHandler>;
}

export class DiscoraClient extends Client {
  slashCommands: Collection<string, ISlashCommand>;
  config: DiscoraClientOptions;
  slashCommandsInJson: any[];

  constructor(config: DiscoraClientOptions) {
    super(config);
    this.config = config;
    this.slashCommands = new Collection();
    this.slashCommandsInJson = [];
  }

  async loadSlashCommands(module: any) {
    const command: ISlashCommand = module.default;

    if ("data" in command && "execute" in command) {
      console.log(command);
      this.slashCommandsInJson.push(command.data.toJSON());
      this.slashCommands.set(command.data.name, command);
    } else {
      console.warn("[Loader]: Warning - 'data' or 'execute' missing");
    }
  }

  async loadCommands() {
    const { handler, root } = this.config;

    if (handler?.slash) {
      if (this.isRecursive("slash")) {
        recursiveLoader(root, handler.slash, this.loadCommands.bind(this));
      } else {
        flatLoader(root, handler.slash, this.loadSlashCommands.bind(this));
      }
    }
  }

  private loadEventModule(module: any) {
    const event = module.default;

    if (!event) {
      console.log("fialed to find defualt event object from event module");
      return;
    }

    if (event.once) {
      this.once(event.name, event.handler.bind(this));
    } else {
      this.on(event.name, event.handler.bind(this));
    }
  }

  async loadEvents() {
    const { handler, root } = this.config;

    if (!handler?.events) {
      return;
    }

    if (this.isRecursive("events")) {
      recursiveLoader(root, handler.events, this.loadEventModule.bind(this));
    } else {
      flatLoader(root, handler.events, this.loadEventModule.bind(this));
    }
  }

  private isRecursive(commandType: "slash" | "message" | "events"): boolean {
    const loaderConfig = this.config.loader;

    if (!loaderConfig) {
      return false;
    }

    if (typeof loaderConfig === "string") {
      return loaderConfig === "recursive";
    }

    if (typeof loaderConfig === "object") {
      return loaderConfig[commandType] === "recursive";
    }
    return false;
  }

  async start() {}
}
