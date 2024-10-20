<!-- @format -->

# Interaction Handlers

Interaction handlers are used to manage different interaction events associated with specific commands. You can create handlers in each command file and export them. Additionally, handlers can be exported via the default export using the handlers object.

## Example

Here’s an example of a button handler and a slash command using the `SlashCommandBuilder`:

```js
export const handlebButtonClick = async (interaction) => {
  // Handle a button click here
};

export default createSlashCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Every starter bot has this command"),

  async execute(interaction) {
    await interaction.reply({ content: "Pong! Click the button for a surprise." });
  },

  handlers: {
    // Handlers can also be defined here
  },
});
```
