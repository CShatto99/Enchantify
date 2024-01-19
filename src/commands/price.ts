import { SlashCommandBuilder } from 'discord.js';
import * as fs from 'fs';
import { BaseInteraction, Enchantments } from '../@types/custom';
import {
  COMMANDS,
  ENCHANTMENTS_FILE_PATH,
  INPUT_OPTIONS,
  MAX_AUTOCOMPLETE_OPTIONS,
} from '../constants';
import getErrorMessage from '../utils/getErrorMessage';

const price = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.price)
    .setDescription('Get the price of an enchantment')
    .addStringOption(option =>
      option
        .setName(INPUT_OPTIONS.enchantment)
        .setDescription('Enter an enchantment name')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction: BaseInteraction) {
    try {
      fs.readFile(ENCHANTMENTS_FILE_PATH, 'utf8', async (error, data) => {
        if (error) {
          console.error(
            `Error opening file located at ${ENCHANTMENTS_FILE_PATH}: `,
            error
          );
          await interaction.reply({
            content: `❌ Error fetching enchantments data`,
            ephemeral: true,
          });
        } else {
          const enchantment = interaction.options.getString(
            INPUT_OPTIONS.enchantment
          );
          const enchantments: Enchantments = JSON.parse(data);
          const { level, price } = enchantments[enchantment];

          await interaction.reply({
            content: `${enchantment} ${level} costs ${price} emeralds.`,
          });
        }
      });
    } catch (error) {
      console.error(`${COMMANDS.price} error: `, error);
      await interaction.reply({
        content: `❌ ${getErrorMessage(error)}`,
        ephemeral: true,
      });
    }
  },
  async autocomplete(interaction: BaseInteraction) {
    try {
      fs.readFile(ENCHANTMENTS_FILE_PATH, 'utf8', async (error, data) => {
        if (error) {
          console.error(
            `Error opening file located at ${ENCHANTMENTS_FILE_PATH}: `,
            error
          );
          await interaction.reply({
            content: `❌ Error fetching enchantments data`,
            ephemeral: true,
          });
        } else {
          // Extract the search term from the interaction's options
          const search = interaction.options.getFocused();

          const enchantments: Enchantments = JSON.parse(data);

          // Create a list of choices with name and value properties
          const options = Object.keys(enchantments).map(enchantment => ({
            name: enchantment,
            value: enchantment,
          }));

          // Filter the choices based on the search term
          const filteredOptions = options
            .slice(0, MAX_AUTOCOMPLETE_OPTIONS)
            .filter(option => option.value.startsWith(search));

          await interaction.respond(filteredOptions);
        }
      });
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

export default price;
