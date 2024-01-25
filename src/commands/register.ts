import { SlashCommandBuilder } from 'discord.js';
import { BaseInteraction } from '../@types/custom';
import { COMMANDS, FEEDBACK } from '../constants';
import Server from '../models/Server';
import getServer from '../utils/db/getServer';
import getErrorMessage from '../utils/getErrorMessage';

const register = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.register)
    .setDescription('Manually register server in Enchantify database'),
  async execute(interaction: BaseInteraction) {
    try {
      const server = await getServer(interaction.guildId);
      if (server) {
        await interaction.reply({
          content: FEEDBACK.serverAlreadyRegistred,
        });
        return;
      }

      await Server.create({ serverId: interaction.guildId });
      await interaction.reply({
        content: FEEDBACK.serverRegistered,
      });
    } catch (error) {
      console.error(`${COMMANDS.register} error: `, error);
      await interaction.reply({
        content: `❌ ${getErrorMessage(error)}`,
        ephemeral: true,
      });
    }
  },
};

export default register;
