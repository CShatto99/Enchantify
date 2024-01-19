import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { client } from '..';
import { Command } from '../@types/custom';
import config from './config';

export default function importCommands() {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) =>
      file.endsWith(config.NODE_ENV === 'production' ? '.js' : '.ts')
    );

  commandsFiles.forEach(async file => {
    const filePath = path.join(commandsPath, file);
    const command: Command = await import(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('default' in command) {
      client.commands.set(command.default.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  });
}
