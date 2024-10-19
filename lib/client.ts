/** @format */

import {
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  REST,
  Routes,
} from "discord.js";

import { flatLoader, recursiveLoader } from "./loaders";
import { ISlashCommand } from "./types";
import { devLog } from "./utils/functions";

type TLoaderEnum = "flat" | "recursive";

export interface loaderConfig {
  events: TLoaderEnum;
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

      command.handlers = command.handlers || {};

      this.slashCommandsInJson.push(command.data.toJSON());

      this.slashCommands.set(command.data.name, command);
      // Initialize as an empty object if undefined

      // Set the command into the collection after any modification
      this.slashCommands.set(command.data.name, command);

      const handlers = Object.keys(module).filter(
        (key) => key.endsWith("Handler") && typeof module[key] === "function"
      );

      handlers.forEach((handler) => {
        console.log(`Registered ${handler} for command: ${command.data.name}`);

        // Assign the handler
        command.handlers![handler] = module[handler]; // Safely assign handler

        // After modification, update the collection with the new handlers
        this.slashCommands.set(command.data.name, command); // Store updated command back
      });

      console.log(this.slashCommands);
    } else {
      devLog(this, "[Loader]: Warning - 'data' or 'execute' missing");
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
      devLog(this, "[Loader]: Failed to find default event object in the event module.");
      return;
    }

    if (event.once) {
      this.once(event.name, (...args) => event.handler(this, ...args));
    } else {
      this.on(event.name, (...args) => event.handler(this, ...args));
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

  private isRecursive(commandType: "slash" |  "events"): boolean {
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

      devLog(this, `Successfully reloaded ${data?.length} application dev (/) commands.`);
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

      devLog(this, `Successfully reloaded ${data?.length} application (/) commands.`);
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

  async handleChatInput(interaction: ChatInputCommandInteraction) {
    const commandName = interaction.commandName;
    const command = this.slashCommands.get(commandName);

    if (!command) {
      return;
    }

    await command.execute(interaction);
  }

  async handleButton(interaction: ButtonInteraction) {
    const commandName = interaction.customId.split("-")[0]; // Assuming command name is part of the custom ID
    const command = this.slashCommands.get(commandName);

    if (!command || !command.handlers) {
      devLog(this, `No command or handlers found for button: ${commandName}`);
      return;
    }

    const handlerName = interaction.customId.split("-")[1]; // Extract the handler name
    const handler = command.handlers["buttonHandler"];

    if (handler && typeof handler === "function") {
      await handler(interaction); // Call the handler
    } else {
      devLog(this, `Handler ${handlerName} not found for command: ${commandName}`);
    }
  }

  async handleAutoComplete(interaction: AutocompleteInteraction) {
    // Get the command name from the interaction
    const commandName = interaction.commandName;

    // Retrieve the command from the slashCommands collection
    const command = this.slashCommands.get(commandName);

    // Check if the command has an autocomplete handler
    if (!command || !command.handlers?.autoCompleteHandler) {
      devLog(
        this,
        `[AutoComplete]: No autocomplete handler found for command: ${commandName}`
      );
      return;
    }

    try {
      // Call the autocomplete handler defined in the command file
      await command.handlers.autoCompleteHandler(interaction);
    } catch (error) {
      devLog(
        this,
        `[AutoComplete]: Failed to handle autocomplete interaction for ${commandName}`,
        error
      );
    }
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
