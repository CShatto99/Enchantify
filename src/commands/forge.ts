import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import * as fs from 'fs';
import { BaseInteraction, Enchantments } from '../@types/custom';
import {
  COMMANDS,
  EMBED_COLOR,
  ENCHANTMENTS_FILE_PATH,
  ENCHANTMENT_LEVELS,
  INPUT_OPTIONS,
  LINKS,
  MAX_AUTOCOMPLETE_OPTIONS,
} from '../constants';
import getErrorMessage from '../utils/getErrorMessage';

const forge = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.forge)
    .setDescription('Calculates the costs to forge an enchanted book')
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
          const enchantment: string = interaction.options.getString(
            INPUT_OPTIONS.enchantment
          );
          const endLevel: string = interaction.options.getString(
            INPUT_OPTIONS.level
          );
          const endLevelNum = ENCHANTMENT_LEVELS[endLevel];
          const enchantments: Enchantments = JSON.parse(data);
          const enchantmentProperties: Enchantments[string] | undefined =
            enchantments[enchantment];

          if (!enchantmentProperties) {
            await interaction.reply({
              content: `❌ Enchantment \`${enchantment}\` is not in your library`,
              ephemeral: true,
            });
            return;
          }

          const { level: startLevel, price } = enchantmentProperties;
          const startLevelNum = ENCHANTMENT_LEVELS[startLevel];

          if (endLevelNum <= startLevelNum) {
            await interaction.reply({
              content: `ℹ️ The entered level must be greater than the ${enchantment} level in your library (${enchantment} ${startLevel})`,
              ephemeral: true,
            });
            return;
          }

          const exponent = endLevelNum - startLevelNum;
          const books = 2 ** exponent;
          const emeralds = books * parseInt(price);

          const embed = new EmbedBuilder()
            .setColor(EMBED_COLOR)
            .setTitle(
              `${enchantment} ${startLevel} -> ${enchantment} ${endLevel}`
            )
            .setFooter({
              text: `Calculations are based on the ${enchantment} level in your enchantment library (${enchantment} ${startLevel})`,
            })
            .addFields([
              { name: 'Emeralds', value: `${emeralds} emeralds` },
              { name: 'Books', value: `${books} books` },
              {
                name: 'Anvils',
                value: `[${(books - 1) / 25} anvils](${LINKS.anvilDurability})`,
              },
            ]);

          await interaction.reply({ embeds: [embed] });
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

export default forge;
