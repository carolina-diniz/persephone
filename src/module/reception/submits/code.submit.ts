import { EmbedBuilder, ModalSubmitInteraction, TextChannel } from 'discord.js';
import 'dotenv/config';
import { Auth, replyMessage } from '../../../core/service';

export async function execute(interaction: ModalSubmitInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const code = interaction.fields.getTextInputValue('input_reception_code');

  if (Auth.verifyCode(interaction.user.id, code)) {
    const member = interaction.guild?.members.resolve(interaction.user.id);
    const entryRole = interaction.guild?.roles.resolve(process.env.ENTRY_ROLE_ID!);

    if (!entryRole) {
      console.error('Role not found');
      return;
    }

    try {
      await member?.roles.add(entryRole).then(() => {
        console.log('Added entry role: ' + entryRole);
      });
      await updateMessage(interaction, Auth.get(interaction.user.id).messageId);

      Auth.delete(interaction.user.id);

      await replyMessage(interaction, 'Entrada Aprovada!');

      console.log(`Entrada do usuário ${interaction.user.displayName} Aprovada! `);

      return;
    } catch (error) {
      console.error(`Erro ao aprovar entrada do usuário ${interaction.user.displayName}:`, error);

      await replyMessage(
        interaction,
        'Erro',
        'Ocorreu um erro ao aprovar a entrada. Entre em contato com um adminstrador para lhe ajudar.',
      );

      return;
    }
  } else {
    await replyMessage(
      interaction,
      'Código Inválido!',
      'Verifique se o código está correto e tente novamente.',
    );
  }
}

async function updateMessage(interaction: ModalSubmitInteraction, messageId: string) {
  const channel = interaction.guild?.channels.resolve(
    process.env.CHANNEL_APPROVE_ID!,
  ) as TextChannel;
  const message = channel.messages.resolve(messageId);

  const embed = new EmbedBuilder(message?.embeds[0].data);

  embed.setTitle('USUÁRIO APROVADO POR EMAIL!');
  embed.setColor('Green');
  embed.setTimestamp(Date.now());

  await message?.edit({ embeds: [embed] });
}
