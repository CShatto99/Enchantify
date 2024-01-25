import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  Guild,
} from 'discord.js';
import { BotClient } from './@types/custom';
import Server from './models/Server';
import config from './utils/config';
import connectDb from './utils/connectDb';
import createInteraction from './utils/createInteraction';
import getServer from './utils/db/getServer';
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

// @ts-ignore
client.once(Events.ClientReady, () => {
  client.user.setActivity({
    name: 'Managing Enchantments 📖',
    type: ActivityType.Custom,
  });
  connectDb();
  importCommands();
  createInteraction();
  registerSlashCommands();
});

// When the bot joins a server, create the Server document if it doesn't exist
client.on(Events.GuildCreate, async (guild: Guild) => {
  const server = await getServer(guild.id);
  if (!server) {
    await Server.create({ serverId: guild.id });
  }
});

client.login(config.BOT_TOKEN);
