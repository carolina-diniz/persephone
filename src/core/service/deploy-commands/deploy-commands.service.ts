import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import { commands } from '../../commands';

export async function deployCommands(clientId: string, guildId: string) {
  const rest: REST = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  const commandsData = Object.values(commands).map((command) => command.data);

  try {
    let data: object[] = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandsData,
    }) as object[];

    console.log(`${data.length} commands successfully deployed to Discord`);
  } catch (error) {
    console.error("Failed to deploy commands to Discord: ", error);
  };
}
