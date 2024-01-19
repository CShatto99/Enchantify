import { SlashCommandBuilder } from 'discord.js';
import * as fs from 'fs';
import { BaseInteraction, Enchantments } from '../@types/custom';
import {
  COMMANDS,
  ENCHANTMENTS_FILE_PATH,
  ENCHANTMENT_LEVELS,
  INPUT_OPTIONS,
  MAX_AUTOCOMPLETE_OPTIONS,
} from '../constants';
import getErrorMessage from '../utils/getErrorMessage';

const forge = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.forge)
    .setDescription(
      'Calculates how many emeralds it costs to forge an enchantment book'
    )
    .addStringOption(option =>
      option
        .setName(INPUT_OPTIONS.enchantment)
        .setDescription('Enter an enchantment name')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
      option
        .setName(INPUT_OPTIONS.level)
        .setDescription('Enter the enchantment level to forge')
        .setRequired(true)
        .addChoices(
          { name: 'I', value: 'I' },
          { name: 'II', value: 'II' },
          { name: 'III', value: 'III' },
          { name: 'IV', value: 'IV' },
          { name: 'V', value: 'V' },
          { name: 'VI', value: 'VI' },
          { name: 'VII', value: 'VII' },
          { name: 'VIII', value: 'VIII' },
          { name: 'IX', value: 'IX' },
          { name: 'X', value: 'X' }
        )
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
          const endLevel: string = interaction.options.getString(
            INPUT_OPTIONS.level
          );
          const endLevelNum: number = ENCHANTMENT_LEVELS[endLevel];
          const enchantments: Enchantments = JSON.parse(data);
          const { level: startLevel, price } = enchantments[enchantment];
          const startLevelNum: number = ENCHANTMENT_LEVELS[startLevel];
          const exponent = endLevelNum - startLevelNum - 1;
          const forgeCost = 2 ** exponent * parseInt(price);

          await interaction.reply({
            content: `It will cost **${forgeCost} emeralds** and **${
              2 ** exponent
            } ${enchantment} ${startLevel}** books to forge **${enchantment} ${endLevel}**.`,
          });
        }
      });
    } catch (error) {
      console.error(`${COMMANDS.forge} error: `, error);
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
          const search: string = interaction.options.getFocused();

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
      console.error(
        `Error occurred during search autocomplete: ${error.message}`
      );

      // Send an error response to the interaction
      await interaction.respond({
        content: `❌ ${getErrorMessage(error)}`,
        ephemeral: true,
      });
    }
  },
};

export default forge;
