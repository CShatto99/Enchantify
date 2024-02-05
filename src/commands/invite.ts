import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BaseInteraction } from '../@types/custom';
import { COMMANDS, EMBED_COLOR, LINKS } from '../constants';

const invite = {
  data: new SlashCommandBuilder()
    .setName(COMMANDS.invite)
    .setDescription('Enchantify Discord invite link'),
  async execute(interaction: BaseInteraction) {
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLOR)
      .setTitle('Invite Link')
      .setDescription(LINKS.invite);

    await interaction.reply({ embeds: [embed] });
  },
};

export default invite;
