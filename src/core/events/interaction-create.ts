import { Interaction } from 'discord.js';
import { buttons } from '../buttons';
import { commands } from '../commands';
import { modals } from '../modals';

export async function InteractionCreate(interaction: Interaction) {
  if (interaction.isCommand()) {
    const { commandName } = interaction;

    if (commandName in commands) {
      console.log(`user: ${interaction.user.displayName} - Executando commando /${commandName}`);
      await commands[commandName as keyof typeof commands].execute(interaction);
    }
  }

  if (interaction.isButton()) {
    const { customId } = interaction;

    if (customId in buttons) {
      console.log(`user: ${interaction.user.displayName} - Executando botão ${customId}`);
      await buttons[customId as keyof typeof buttons].execute(interaction);
    }
  }

  if (interaction.isModalSubmit()) {
    const { customId } = interaction;

    if (customId in modals) {
      console.log(`user: ${interaction.user.displayName} - Executando modal ${customId}`);
      await modals[customId as keyof typeof modals].execute(interaction);
    }
  }
}
