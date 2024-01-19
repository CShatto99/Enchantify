import { Client, Events, GatewayIntentBits } from 'discord.js';
import { BotClient } from './@types/custom';
import config from './utils/config';
import createInteraction from './utils/createInteraction';
import importCommands from './utils/importCommands';
import registerSlashCommands from './utils/registerSlashCommands';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
}) as BotClient;

client.once(Events.ClientReady, () => {
  importCommands();
  createInteraction();
  registerSlashCommands();
});

client.login(config.BOT_TOKEN);
