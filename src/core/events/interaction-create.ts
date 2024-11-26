import { Interaction } from 'discord.js';
import { buttons } from '../buttons';
import { commands } from '../commands';
import { modals } from '../modals';

export async function InteractionCreate(interaction: Interaction) {
  if (interaction.isCommand()) {
    const { commandName } = interaction;
    console.log(`user: ${interaction.user.displayName} - Executando commando /${commandName}`);

    if (commandName in commands) {
      await commands[commandName as keyof typeof commands].execute(interaction);
    }
  }

  if (interaction.isButton()) {
    const { customId } = interaction;
    console.log(`user: ${interaction.user.displayName} - Executando botão ${customId}`);

    if (customId in buttons) {
      await buttons[customId as keyof typeof buttons].execute(interaction);
    }
  }

  if (interaction.isModalSubmit()) {
    const { customId } = interaction;
    console.log(`user: ${interaction.user.displayName} - Executando modal ${customId}`);

    if (customId in modals) {
      await modals[customId as keyof typeof modals].execute(interaction);
    }
  }
}
