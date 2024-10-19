/** @format */

import { Client, ClientOptions, Collection } from "discord.js";
import { flatLoader, recursiveLoader } from "./loaders";
import { ISlashCommand } from "./types";

type TLoaderEnum = "flat" | "recursive";

interface loaderConfig {
  events: TLoaderEnum;
  message: TLoaderEnum;
  slash: TLoaderEnum;
}

interface CommandDir {
  slash: string;
  message: string;
}

interface DiscoraClientOptions extends ClientOptions {
  root: string;
  loader?: TLoaderEnum | loaderConfig;
  commandsFolders?: Partial<CommandDir>;
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
    const { commandsFolders, root } = this.config;

    if (commandsFolders?.slash) {
      if (this.isRecursive("slash")) {
        recursiveLoader(root, commandsFolders.slash, this.loadCommands.bind(this));
      } else {
        flatLoader(root, commandsFolders.slash, this.loadSlashCommands.bind(this));
      }
    }
  }

  private isRecursive(commandType: "slash" | "message"): boolean {
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
