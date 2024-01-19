import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js';
import { BotClient } from './@types/custom';
import config from './utils/config';
import createInteraction from './utils/createInteraction';
import importCommands from './utils/importCommands';
import registerSlashCommands from './utils/registerSlashCommands';

export const client: BotClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  client.user.setActivity({
    name: 'Managing Enchantments📖',
    type: ActivityType.Custom,
  });
  importCommands();
  createInteraction();
  registerSlashCommands();
});

client.login(config.BOT_TOKEN);
