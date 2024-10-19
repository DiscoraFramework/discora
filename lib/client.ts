/** @format */

import {
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  REST,
  Routes,
} from "discord.js";

import { flatLoader, recursiveLoader } from "./loaders";
import { ISlashCommand } from "./types";

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

export interface DiscoraClientOptions {
  root: string;
  token: string;
  clientId: string;
  environment?: "production" | "development";
  guildId?: string;
  loader?: TLoaderEnum | loaderConfig;
  handler?: Partial<ClientHandler>;
  client: ClientOptions;
}

function _defaults(options: DiscoraClientOptions) {
  const _options: DiscoraClientOptions = {
    ...options,
    loader: options.loader || "flat",
    environment: options.environment || "development",
    root: options.root || process.cwd(),
  };

  return _options;
}

export class DiscoraClient extends Client {
  slashCommands: Collection<string, ISlashCommand>;
  config: DiscoraClientOptions;
  slashCommandsInJson: any[];

  constructor(config: DiscoraClientOptions) {
    super(config.client);
    this.config = _defaults(config);
    this.slashCommands = new Collection();
    this.slashCommandsInJson = [];
  }

  async loadSlashCommandsModule(module: any) {
    const command: ISlashCommand = module.default;

    if ("data" in command && "execute" in command) {
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
        flatLoader(root, handler.slash, this.loadSlashCommandsModule.bind(this));
      }
    }
  }

  private loadEventModule(module: any) {
    const event = module.default;

    if (!event) {
      console.log("fialed to find defualt event object from event module");
      return;
    }

    console.log("loaded", event);

    if (event.once) {
      //this.once(event.name, event.handler.apply(this, ...args));
    } else {
     // this.on(event.name,  event.handler.apply(this, ...args));
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
  private async registerGuildCommands() {
    try {
      const clientId = this.config.clientId;
      const guildId = this.config.guildId as string;

      const rest = new REST().setToken(this.config.token);

      const data: any = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        {
          body: this.slashCommandsInJson,
        }
      );

      console.log(`Successfully reloaded ${data?.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  }
  private async registerGlobalCommands() {
    try {
      const clientId = this.config.clientId;

      const rest = new REST().setToken(this.config.token);

      const data: any = await rest.put(Routes.applicationCommands(clientId), {
        body: this.slashCommandsInJson,
      });

      console.log(`Successfully reloaded ${data?.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  }

  async registerCommand() {
    const { environment, clientId, guildId } = this.config;

    if (!clientId) {
      throw new Error("ClientId is required to register commands.");
    }

    if (environment === "development") {
      if (!guildId) {
        throw new Error("GuildId is required to register guild commands in development.");
      }
      return await this.registerGuildCommands();
    }

    // If in production, register global commands
    await this.registerGlobalCommands();
  }

  // command handlers

  async handleChatInputCommand(interaction: ChatInputCommandInteraction) {
    const commandName = interaction.commandName;
    const command = this.slashCommands.get(commandName);

    if (!command) {
      return;
    }

    await command.execute(interaction);
  }

  async start() {
    if (!this.config.token) {
      console.log("token is required in order to start your bot");
    }

    await this.loadCommands();
    await this.loadEvents();

    await this.registerCommand();

    await this.login(this.config.token);
  }
}
