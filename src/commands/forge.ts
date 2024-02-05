import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseInteraction } from '../@types/custom';
import {
  ANVIL_DURABILITY,
  COMMANDS,
  EMBED_COLOR,
  ENCHANTMENT_LEVELS,
  FEEDBACK,
  INPUT_OPTIONS,
  LINKS,
  MAX_AUTOCOMPLETE_OPTIONS,
} from '../constants';
import getServer from '../utils/db/getServer';
import getErrorMessage from '../utils/getErrorMessage';

const forge = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.forge)
    .setDescription(
      'Calculates the amount of emeralds, books, and anvils it costs to forge an enchanted book'
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
      const endLevel: string = interaction.options.getString(
        INPUT_OPTIONS.level
      );
      const endLevelNum = ENCHANTMENT_LEVELS[endLevel];
      const enchantmentFound = server.enchantments.get(enchantment);

      if (!enchantmentFound) {
        await interaction.reply({
          content: FEEDBACK.enchantmentNotFound(enchantment),
          ephemeral: true,
        });
        return;
      }

      const { level: startLevel, price } = enchantmentFound;
      const startLevelNum = ENCHANTMENT_LEVELS[startLevel];

      if (endLevelNum <= startLevelNum) {
        await interaction.reply({
          content: FEEDBACK.levelOutOfRange(enchantment, startLevel),
          ephemeral: true,
        });
        return;
      }

      const exponent = endLevelNum - startLevelNum;
      const books = 2 ** exponent;
      const emeralds = books * parseInt(price);

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setTitle(`${enchantment} ${startLevel} -> ${enchantment} ${endLevel}`)
        .setFooter({
          text: `Calculations are based on the ${enchantment} level in your enchantment library (${enchantment} ${startLevel})`,
        })
        .addFields([
          { name: 'Emeralds', value: `${emeralds} emeralds` },
          { name: 'Books', value: `${books} books` },
          {
            name: 'Anvils',
            value: `[${(books - 1) / ANVIL_DURABILITY} anvils](${LINKS.anvilDurability})`,
          },
        ]);

      await interaction.reply({ embeds: [embed] });
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

export default forge;
