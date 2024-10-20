# Discora 


Setting up a Discord bot can often feel overwhelming, especially for developers who are new to the platform or looking to optimize their workflow. Here are some common challenges you might face:

1. **Complex Configuration**: Managing multiple components, such as command and event handling, typically requires a lot of repetitive boilerplate code, leading to confusion and errors.

2. **Manual Command Registration**: As your bot's functionality grows, manually registering each command can become tedious and prone to mistakes, complicating the overall structure.

3. **Scattered Event Logic**: Event handling logic can become disorganized, making it difficult to track how events are processed and resulting in inconsistent bot behavior.

4. **Steep Learning Curve**: New developers may struggle to learn the setup process, particularly without clear guidance on using Node.js or Discord.js.

5. **Debugging Challenges**: Poor organization of command and event logic can make debugging time-consuming and complicate ongoing maintenance and updates.

Discora aims to alleviate these pain points by providing a streamlined framework that simplifies the setup and management of Discord bots, allowing developers to focus on creating engaging experiences for their users.



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



# Discora Basics

### Setup

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

### `DiscoraClient` Options

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



### Slash Command

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

### Creating an Event

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

Here's the updated section with the `handleButtonClick` export example for clarity:

---

## Handlers

There may come a time when you have multiple types of interactions such as **buttons**, **autocomplete**, **modal submissions**, and **context menus** that need to be handled. Managing these interactions in a cluttered way can make your code hard to maintain. Discora provides two ways to handle these interaction events to keep your code clean and organized.

### Example with Exported Handler

You can export your interaction handlers separately to keep your logic clean and maintainable. Here’s an example of exporting the `handleButtonClick` handler while keeping the slash command functionality in the same file:

```ts
import { SlashCommandBuilder } from "discord.js";
import { createSlashCommand } from "discora";

// Export button handler separately
export const handleButtonClick = async (interaction) => {
  if (interaction.customId === "ping_button") {
    await interaction.reply("Button clicked after ping!");
  }
};

// Slash command with basic execute function
export default createSlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  execute: async (interaction) => {
    await interaction.reply({
      content: "Pong!",
      components: [
        {
          type: 1, // Action row
          components: [
            {
              type: 2, // Button
              label: "Click me",
              style: 1,
              custom_id: "ping_button",
            },
          ],
        },
      ],
    });
  },
});
```

In this example:

- **handleButtonClick**: This function is exported and can be handled separately when a button with `customId` `"ping_button"` is clicked.
- **SlashCommandBuilder**: This defines the slash command `/ping`, which replies with "Pong!" and includes a button interaction.

### Keeping It Organized

By exporting the interaction handler (like `handleButtonClick`), you can easily import this into event files or other modules, making your bot logic cleaner and easier to scale as your bot grows.







