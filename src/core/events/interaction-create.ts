import { Interaction } from 'discord.js';
import { commands } from '../commands';

export async function InteractionCreate(interaction: Interaction) {
  if (interaction.isCommand()) {
    const { commandName } = interaction;

    if (commandName in commands) {
      console.log(`user: ${interaction.user.displayName} - Executando commando /${commandName}`);
      await commands[commandName as keyof typeof commands].execute(interaction);
    }
  }
}
