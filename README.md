<!-- @format -->


## Discora

Building a Discord bot can be tricky, especially for new developers. Here are some common challenges:

1. ⚙️ **Complex Setup**: Managing commands and events can involve a lot of repetitive code, leading to mistakes.
2. 🔄 **Unorganized Event Logic**: Event handling can become hard to track, causing the bot to behave unpredictably.
3. 🧠 **Steep Learning Curve**: Learning how to set up a bot with Node.js and Discord.js can be tough.
4. 🐞 **Debugging Issues**: Poorly organized code can make fixing problems harder.

Discora, built with **TypeScript** and **type safety** in mind, provides **IntelliSense** support, helping you write better code with fewer errors. The framework keeps everything simple and organized, so you can focus on building great bots.


## Installation

You can install Discora using npm:

```bash
npm install discora
```

Alternatively, you can quickly set up a new project with Discora using npx:

```bash
npx create-discora@latest
```

## Support

For support, visit the documention or join our Discord server.
Here’s the updated documentation without the additional handlers:

## Discora Basics

The `DiscoraClient` extends the Discord.js Client class, handling most of the heavy lifting while still giving you full access to the underlying Client. This allows you to focus on your bot's functionality without worrying about the boilerplate. With `DiscoraClient`, managing commands, events, and other aspects of your bot becomes straightforward.

Here’s how you can set up your client:

```js
import { DiscoraClient } from "discora";

const client = new DiscoraClient({
  root: process.cwd(), // Root directory (required by Discora)
  token: "Your bot token", // Your Discord bot token (required)
  clientId: "Your bot clientId", // Your bot's client ID (required)
  guildId: "Your guild ID", // Guild where commands are registered (required)
  handler: { events: "/events", slash: "/commands" }, // Paths for event & command handlers
  environment: "development", // Use 'production' for global command registration
  loader: { events: "flat", slash: "recursive" }, // How to load events and commands
  client: { intents: ["GuildMessages", "GuildMembers"] }, // Bot's intents
});

client.start(); // Load commands & events, then start the bot
```

## `DiscoraClient` Options

- **root**: The project’s root directory, essential for locating your files.
- **token**: Your Discord bot token for API authentication (required).
- **clientId**: The unique identifier for your bot, used for command registration (required).
- **guildId**: The ID of the guild where slash commands are registered (required).
- **handler**: Object specifying the paths for event and slash command handlers:
  - **events**: Directory for event handler files (e.g., `/events`).
  - **slash**: Directory for slash command files (e.g., `/commands`).
- **environment**: Controls command registration:
  - `"development"`: Registers commands only in the specified guild.
  - `"production"`: Registers commands globally.
- **loader**: Controls how event and command files are loaded:
  - **events**: `"flat"` to load all event files from a single directory.
  - **slash**: `"recursive"` to load commands from subdirectories.
- **client**: Configuration options for the Discord.js Client:
  - **intents**: Specifies which events the bot should listen for, such as `"GuildMessages"` and `"GuildMembers"`.

## Slash Command

Here’s how you can create a basic slash command:

```ts
import { SlashCommandBuilder } from "discord.js";
import { createSlashCommand } from "discora";

export default createSlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  execute: async (interaction) => {
    await interaction.reply("Pong!");
  },
});
```

- **data**: The command data defined using the `SlashCommandBuilder`. This includes the command name, description, and any options.
- **execute**: The function executed when a user invokes the slash command. It has access to the interaction object from Discord.js, allowing you to respond to the user.

## Creating an Event

If you used the `create-discora@latest` CLI tool, your `events/ready.ts` file might look like this:

```js
import { Events } from "discord.js";
import { createEvent } from "discora";

export default createEvent({
  name: Events.ClientReady,
  once: true,
  handler: async (_, client) => {
    console.log(`${client.user.username} is online and ready!`);
  },
});
```

This setup defines a **ready event** for your bot, which logs a message when your bot goes online. You can customize the `handler` function to include additional functionality.



## Handlers

You can export interaction handlers separately to keep your code clean. In this example, button custom IDs are prefixed with the command name to ensure the handler logic matches the command.

```ts
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

import {
  createSlashCommand,
  HandleButtonClickFunction,
} from "../lib";

// Button interaction handler
export const handleButtonClick: HandleButtonClickFunction = async (
  interaction
) => {
  if (interaction.customId === "ping-hello_button") {
    await interaction.reply("Hello, world!");
  } else if (interaction.customId === "ping-hi_button") {
    await interaction.reply("Hi!");
  }
};

// Slash command logic
export default createSlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("A test command"),

  execute: async (interaction) => {
    const helloButton = new ButtonBuilder()
      .setCustomId("ping-hello_button")
      .setLabel("Say Hello")
      .setStyle(ButtonStyle.Primary);

    const hiButton = new ButtonBuilder()
      .setCustomId("ping-hi_button")
      .setLabel("Say Hi")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(helloButton, hiButton);

    await interaction.reply({
      content: "How do you want me to respond?",
      components: [row],
    });
  },
});
```

### Key Points:

1. **Custom IDs**: Button custom IDs are prefixed with the command name (`ping-`) to ensure the handler logic matches the command.
2. **Separated Handlers**: The `handleButtonClick` function handles button interactions separately, keeping the code modular and maintainable.
3. **Usage**: The handler triggers for any button with a custom ID prefixed with `ping-`, such as `ping-hello_button`, specifically for that command.
