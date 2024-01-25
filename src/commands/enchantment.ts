import { SlashCommandBuilder } from 'discord.js';
import { BaseInteraction } from '../@types/custom';
import {
  COMMANDS,
  FEEDBACK,
  GEAR_OPTIONS,
  GEAR_TYPE_DELIMITER,
  INPUT_OPTIONS,
  MAX_AUTOCOMPLETE_OPTIONS,
} from '../constants';
import getServer from '../utils/db/getServer';
import getErrorMessage from '../utils/getErrorMessage';

const enchantment = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.enchantment)
    .setDescription('Add or update an enchantment in your enchantment library')
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
        .setDescription(
          `Enter 1 or more gear types separated by a comma (${GEAR_TYPE_DELIMITER})`
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
      const level: string = interaction.options.getString(INPUT_OPTIONS.level);
      const price: string = interaction.options.getString(INPUT_OPTIONS.price);
      const gear: string | undefined = interaction.options.getString(
        INPUT_OPTIONS.gear
      );

      const gearTypes: string[] = [];
      const unsupportedGear = [];
      if (gear) {
        gear.split(GEAR_TYPE_DELIMITER).forEach(gearType => {
          const lowerGearType = gearType.trim().toLowerCase();
          const gearFound = GEAR_OPTIONS.find(({ values }) =>
            values.includes(lowerGearType)
          );
          if (gearFound) {
            gearTypes.push(gearFound.name);
          } else {
            unsupportedGear.push(gearType);
          }
        });
      }

      // User entered at least one unsupported gear type
      if (unsupportedGear.length > 0) {
        await interaction.reply({
          content: FEEDBACK.unsupportedGear,
          ephemeral: true,
        });
        return;
      }

      const enchantmentFound = server.enchantments.get(enchantment);
      const newEnchantment = { level, price, gear: gearTypes };

      server.enchantments.set(enchantment, newEnchantment);
      server.save();

      await interaction.reply({
        content: `${enchantment} ${level} ${enchantmentFound ? 'updated' : 'added'}`,
      });
    } catch (error) {
      console.error(`${COMMANDS.enchantment} error: `, error);
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

export default enchantment;
