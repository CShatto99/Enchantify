import { Events } from 'discord.js';
import { BaseInteraction, Command } from '../@types/custom';
import { client } from '../index';

/**
 * Sets up an event handler for handling Discord interactions.
 *
 * @function
 * @returns This function does not return a value.
 */
export default function createInteraction() {
  client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    const command: Command = interaction.client.commands.get(
      interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    if (
      interaction.isChatInputCommand() ||
      interaction.isMessageContextMenuCommand()
    ) {
      try {
        await command.default.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied) {
          await interaction.followUp({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isAutocomplete()) {
      try {
        await command.default.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  });
}
