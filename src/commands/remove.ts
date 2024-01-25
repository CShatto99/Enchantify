import { SlashCommandBuilder } from 'discord.js';
import { BaseInteraction } from '../@types/custom';
import {
  COMMANDS,
  FEEDBACK,
  INPUT_OPTIONS,
  MAX_AUTOCOMPLETE_OPTIONS,
} from '../constants';
import getServer from '../utils/db/getServer';
import getErrorMessage from '../utils/getErrorMessage';
import simpleSearch from '../utils/simpleSearch';

const remove = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.remove)
    .setDescription('Remove an enchantment')
    .addStringOption(option =>
      option
        .setName(INPUT_OPTIONS.enchantment)
        .setDescription('Enter an enchantment name')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction: BaseInteraction) {
    try {
      const server = await getServer(interaction.guildId);

      if (!server) {
        await interaction.reply({
          content: FEEDBACK.serverNotFound,
          ephemeral: true,
        });
        return;
      }

      const enchantment: string = interaction.options.getString(
        INPUT_OPTIONS.enchantment
      );
      const enchantmentFound = server.enchantments.get(enchantment);

      if (!enchantmentFound) {
        const similarSearch = simpleSearch(
          enchantment,
          Array.from(server.enchantments.keys())
        );
        await interaction.reply({
          content:
            similarSearch.length > 0
              ? `❌ Enchantment not found, closest match: ${similarSearch[0]}`
              : `❌ Enchantment not found, try a different enchantment`,
          ephemeral: true,
        });
        return;
      }

      server.enchantments.delete(enchantment);
      server.save();

      await interaction.reply({
        content: `✅ ${enchantment} ${enchantmentFound.level} removed`,
      });
    } catch (error) {
      console.error(`${COMMANDS.remove} error: `, error);
      await interaction.reply({
        content: `❌ ${getErrorMessage(error)}`,
        ephemeral: true,
      });
    }
  },
  async autocomplete(interaction: BaseInteraction) {
    try {
      const server = await getServer(interaction.guildId);

      // Extract the search term from the interaction's options
      const search = interaction.options.getFocused();

      // Create a list of choices with name and value properties
      const options = Array.from(server?.enchantments.keys() ?? []).map(
        enchantment => ({
          name: enchantment,
          value: enchantment,
        })
      );

      // Filter the choices based on the search term
      const filteredOptions = options
        .slice(0, MAX_AUTOCOMPLETE_OPTIONS)
        .filter(option => option.value.startsWith(search));

      await interaction.respond(filteredOptions);
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      console.error(`Error occurred during search autocomplete: ${errorMsg}`);

      // Send an error response to the interaction
      await interaction.respond({
        content: `❌ ${errorMsg}`,
        ephemeral: true,
      });
    }
  },
};

export default remove;
