import { APIEmbedField, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import * as fs from 'fs';
import { BaseInteraction, Enchantments } from '../@types/custom';
import {
  COMMANDS,
  EMBED_COLOR,
  ENCHANTMENTS_FILE_PATH,
  GEAR_OPTIONS,
  INPUT_OPTIONS,
} from '../constants';
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
          const enchantments: [string, Enchantments[string]][] = Object.entries(
            JSON.parse(data)
          );
          const gear: string = interaction.options.getString(
            INPUT_OPTIONS.gear
          );
          const organize: string = interaction.options.getString(
            INPUT_OPTIONS.organize
          );
          const filteredEnchantments = enchantments.filter(
            ([, properties]) =>
              !gear ||
              properties.gear.includes(gear) ||
              properties.gear.length === 0
          );

          const embedFields: APIEmbedField[] = [];
          let content: string | null = null;

          if (filteredEnchantments.length === 0) {
            content = `🔍 No enchantments found, try adding one to your library with the \`/enchantment\` command`;
          } else if (!gear && organize !== 'No') {
            // Show all enchantments when no gear type is specified AND organize is undefined
            GEAR_OPTIONS.forEach(gearOption => {
              const gearEnchantments = enchantments.filter(
                ([, properties]) =>
                  properties.gear.includes(gearOption.name) ||
                  properties.gear.length === 0
              );
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
            // Only show enchantments for provided gear type
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
        }
      });
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
