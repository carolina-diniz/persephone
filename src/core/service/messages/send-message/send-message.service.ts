import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  MessageCreateOptions,
  ModalSubmitInteraction,
} from 'discord.js';
import { ShoppService } from '../../shopp';
import { ValidateEmailService } from '../../validate-email';

export async function sendMessage(
  interaction: ModalSubmitInteraction,
  channelId: string,
  title: string,
  fields: {
    name: string;
    email?: string;
    doubt?: string;
  },
): Promise<Message<true>> {
  return new Promise(async (resolve, reject) => {
    try {
      const channel = await interaction.guild?.channels.resolve(channelId);
      const { name, email, doubt } = fields;
      const { user } = interaction;

      const messageOptions: MessageCreateOptions = {};

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setTimestamp(Date.now())
        .setFields([
          { name: 'Usuário', value: `<@${user.id}>`, inline: false },
          { name: 'Nome', value: `||${name}||`, inline: false },
        ])
        .setColor(ShoppService.colors.globogamers)
        .setThumbnail(user.displayAvatarURL());

      if (email) {
        embed.addFields({ name: 'Usuário', value: `||${email}||`, inline: false });

        if (!(await ValidateEmailService.isValidGloboDomain(email))) {
          const aprovar = new ButtonBuilder()
            .setCustomId('button_reception_approve')
            .setLabel('Aprovar')
            .setStyle(ButtonStyle.Success);

          const reprovar = new ButtonBuilder()
            .setCustomId('button_reception_reprove')
            .setLabel('Reprovar')
            .setStyle(ButtonStyle.Danger);

          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(aprovar, reprovar);

          messageOptions['components'] = [row];
        }
      }

      if (doubt) {
        embed.addFields({ name: 'Dúvida', value: `${doubt}`, inline: false });

        const resolved = new ButtonBuilder()
          .setCustomId('button_reception_resolved')
          .setLabel('Resolvido')
          .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(resolved);

        messageOptions['components'] = [row];
      }

      if (!channel?.isSendable()) throw new Error('Channel is not sendable');

      console.log(`Enviando mensagem no canal ${channel.name}.`);

      messageOptions['embeds'] = [embed];

      const message = await channel.send(messageOptions);

      resolve(message);
    } catch (error) {
      console.error('Error to send message: \n', error);
      reject(error);
    }
  });
}
