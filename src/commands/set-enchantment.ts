import { SlashCommandBuilder } from 'discord.js';
import * as fs from 'fs';
import { BaseInteraction, Enchantments } from '../@types/custom';
import {
  COMMANDS,
  INPUT_OPTIONS,
  MAX_AUTOCOMPLETE_OPTIONS,
} from '../constants';
import { ENCHANTMENTS_FILE_PATH } from '../constants/index';
import getErrorMessage from '../utils/getErrorMessage';

const setEnchantment = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.setEnchantment)
    .setDescription('Set or update the price of an enchantment')
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
        .setDescription('Enter an enchantment level')
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
    )
    .addStringOption(option =>
      option
        .setName(INPUT_OPTIONS.price)
        .setDescription('Enter the emerald price of the enchantment')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName(INPUT_OPTIONS.gear)
        .setDescription('Enter 1 or more gear types separated by a |')
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
          const enchantment: string = interaction.options.getString(
            INPUT_OPTIONS.enchantment
          );
          const level: string = interaction.options.getString(
            INPUT_OPTIONS.level
          );
          const price: string = interaction.options.getString(
            INPUT_OPTIONS.price
          );
          const gear: string = interaction.options.getString(
            INPUT_OPTIONS.gear
          );
          const gearTypes = gear
            ? gear.split('|').map(gearType => gearType.trim())
            : [];
          const enchantments: Enchantments = JSON.parse(data);
          const newEnchantments: Enchantments = {
            ...enchantments,
            ...{ [enchantment]: { level, price, gear: gearTypes } },
          };

          fs.writeFile(
            ENCHANTMENTS_FILE_PATH,
            JSON.stringify(newEnchantments, null, 2),
            async error => {
              if (error) {
                console.error(
                  `Error writing to file located at ${ENCHANTMENTS_FILE_PATH}: `,
                  error
                );
                await interaction.reply({
                  content: `❌ Error updating enchantments data`,
                  ephemeral: true,
                });
              } else {
                console.log('Data has been written to', ENCHANTMENTS_FILE_PATH);
                await interaction.reply({
                  content: `${enchantment} ${level} added.`,
                });
              }
            }
          );
        }
      });
    } catch (error) {
      console.error(`${COMMANDS.setEnchantment} error: `, error);
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

export default setEnchantment;
