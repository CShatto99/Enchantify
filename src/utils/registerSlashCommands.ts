import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Command } from '../@types/custom';
import config from './config';

/**
 * Registers or updates Discord slash commands for the bot.
 *
 * @function
 * @returns A Promise that resolves when the commands are successfully registered or updated.
 */
export default async function registerSlashCommands() {
  const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  const importPromises: Promise<Command>[] = [];
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) =>
      file.endsWith(config.NODE_ENV === 'production' ? '.js' : '.ts')
    );

  commandsFiles.forEach(async file => {
    const filePath = path.join(commandsPath, file);
    importPromises.push(import(filePath));
  });

  const importedCommands = await Promise.all(importPromises);
  importedCommands.forEach(file => {
    commands.push(file.default.data.toJSON());
  });

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(
      Routes.applicationCommands(config.APPLICATION_ID),
      { body: commands }
    )) as { length: number };

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}
