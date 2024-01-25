import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseInteraction } from '../@types/custom';
import {
  COMMANDS,
  EMBED_COLOR,
  FEEDBACK,
  GEAR_OPTIONS,
  INPUT_OPTIONS,
} from '../constants';
import getServer from '../utils/db/getServer';
import getErrorMessage from '../utils/getErrorMessage';

const enchantments = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.enchantments)
    .setDescription('List all enchantments with optional parameters')
    .addStringOption(option =>
      option
        .setName(INPUT_OPTIONS.gear)
        .setDescription('Enter a gear type')
        .addChoices(
          {
            name: 'Helmet',
            value: 'Helmet',
          },
          {
            name: 'Chest',
            value: 'Chest',
          },
          {
            name: 'Legs',
            value: 'Legs',
          },
          {
            name: 'Boots',
            value: 'Boots',
          },
          {
            name: 'Weapon',
            value: 'Weapon',
          },
          {
            name: 'Hammer',
            value: 'Hammer',
          },
          {
            name: 'Trident',
            value: 'Trident',
          },
          {
            name: 'Shield',
            value: 'Shield',
          },
          {
            name: 'Bow',
            value: 'Bow',
          },
          {
            name: 'Crossbow',
            value: 'Crossbow',
          },
          {
            name: 'Pickaxe',
            value: 'Pickaxe',
          },
          {
            name: 'Axe',
            value: 'Axe',
          },
          {
            name: 'Shovel',
            value: 'Shovel',
          },
          {
            name: 'Hoe',
            value: 'Hoe',
          },
          {
            name: 'Fishing Pole',
            value: 'Fishing Pole',
          },
          {
            name: 'Shears',
            value: 'Shears',
          },
          {
            name: 'Weapon',
            value: 'Weapon',
          }
        )
    )
    .addStringOption(option =>
      option
        .setName(INPUT_OPTIONS.organize)
        .setDescription(
          'If No, enchantments will not be organized by gear type'
        )
        .addChoices({ name: 'No', value: 'No' })
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

      const enchantments = Array.from(server.enchantments.entries());
      const gear: string = interaction.options.getString(INPUT_OPTIONS.gear);
      const organize: string = interaction.options.getString(
        INPUT_OPTIONS.organize
      );
      const filteredEnchantments = enchantments.filter(([, properties]) => {
        return (
          !gear ||
          properties.gear.includes(gear) ||
          properties.gear.length === 0
        );
      });

      const embedFields: APIEmbedField[] = [];
      let content: string | null = null;

      if (filteredEnchantments.length === 0) {
        await interaction.reply({
          content: FEEDBACK.noEnchantments,
          ephemeral: true,
        });
        return;
      }

      if (!gear && organize !== 'No') {
        // Show all enchantments when no gear type is specified AND organize is not 'No'
        GEAR_OPTIONS.forEach(gearOption => {
          const gearEnchantments = enchantments.filter(
            ([, properties]) =>
              properties.gear.includes(gearOption.name) ||
              properties.gear.length === 0
          );
          // Don't add the embed if no enchantments exist for the gear type
          if (gearEnchantments.length === 0) {
            return;
          }
          embedFields.push({
            name: gearOption.name,
            value: gearEnchantments
              .map(
                ([enchantment, properties]) =>
                  `\n${enchantment} ${properties.level} (${properties.price} emeralds)`
              )
              .join(''),
          });
        });
      } else {
        // Only show enchantments for the provided gear type
        content = filteredEnchantments
          .map(
            ([enchantment, properties]) =>
              `\n${enchantment} ${properties.level} (${properties.price} emeralds)`
          )
          .join('');
      }

      const embed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setTitle(`${gear ?? 'All'} Enchantments`)
        .setDescription(content)
        .addFields(embedFields);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`${COMMANDS.enchantments} error: `, error);
      await interaction.reply({
        content: `❌ ${getErrorMessage(error)}`,
        ephemeral: true,
      });
    }
  },
};

export default enchantments;
