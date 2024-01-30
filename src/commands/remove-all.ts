import {
  ActionRowBuilder,
  ComponentType,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import { BaseInteraction } from '../@types/custom';
import { COMMANDS, FEEDBACK } from '../constants';
import Server from '../models/Server';
import getErrorMessage from '../utils/getErrorMessage';

const removeAll = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.removeAll)
    .setDescription('Removes all enchantments'),
  async execute(interaction: BaseInteraction) {
    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        await interaction.reply({
          content: FEEDBACK.adminsOnly,
          ephemeral: true,
        });
        return;
      }
      const select = new StringSelectMenuBuilder()
        .setCustomId('confirmation')
        .setPlaceholder('Select an option')
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel('Yes')
            .setValue('Yes')
            .setDescription('Delete all enchantments from your server'),
          new StringSelectMenuOptionBuilder()
            .setLabel('No')
            .setValue('No')
            .setDescription('Cancel this command')
        );

      const row = new ActionRowBuilder().addComponents(select);

      const response = await interaction.reply({
        content:
          'Are you sure you want to delete all enchantments from this server?',
        components: [row],
      });

      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 60_000,
      });

      collector.on('collect', async (i: BaseInteraction) => {
        const selection: 'Yes' | 'No' = i.values[0];

        if (selection === 'Yes') {
          await Server.findOneAndUpdate(
            { serverId: i.guildId },
            { enchantments: new Map() }
          );
          await i.reply({ content: FEEDBACK.enchantmentsRemoved });
        }
      });
    } catch (error) {
      console.error(`${COMMANDS.remove} error: `, error);
      await interaction.reply({
        content: `❌ ${getErrorMessage(error)}`,
        ephemeral: true,
      });
    }
  },
};

export default removeAll;
