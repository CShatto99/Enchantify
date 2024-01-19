import { SlashCommandBuilder } from 'discord.js';
import * as fs from 'fs';
import { BaseInteraction, Enchantments } from '../@types/custom';
import { COMMANDS, ENCHANTMENTS_FILE_PATH, INPUT_OPTIONS } from '../constants';
import getErrorMessage from '../utils/getErrorMessage';

const enchantments = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.enchantments)
    .setDescription('List all enchantments with optional filters')
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
          const gear: string = interaction.options.getString(
            INPUT_OPTIONS.gear
          );
          const enchantments: [string, Enchantments[string]][] = Object.entries(
            JSON.parse(data)
          );
          const filteredEnchantments = enchantments.filter(
            ([, properties]) => !gear || properties.gear.includes(gear)
          );

          if (filteredEnchantments.length === 0) {
            await interaction.reply({
              content: `🔍 No enchantments found`,
            });
            return;
          }

          let content = '```\n';
          filteredEnchantments.forEach(([enchantment, properties]) => {
            content += `${enchantment} ${properties.level} (${properties.price} emeralds)\n`;
          });
          content += '```';

          await interaction.reply({
            content: `**${gear ?? 'All'} Enchantments** \n${content}`,
          });
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
