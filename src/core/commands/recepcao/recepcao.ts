import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { memberPermission, ShoppService } from '../../service';

export const data = new SlashCommandBuilder()
  .setName('recepcao')
  .setDescription('Cria mensagem no canal para verificação de identidade globo.');

export async function execute(interaction: CommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  if (!memberPermission(interaction, 'Administrator')) {
    await replyMessage(
      interaction,
      'PARADO AI!',
      'Você não tem permissão para executar este comando!',
    );
    return;
  }

  await sendMessage(interaction);

  await interaction.deleteReply();
}

async function replyMessage(
  interaction: CommandInteraction,
  title: string,
  description: string,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(ShoppService.colors.globogamers);

  await interaction.editReply({ embeds: [embed] });
}

async function sendMessage(interaction: CommandInteraction): Promise<void> {
  const channel = interaction.guild?.channels.resolve(interaction.channelId);

  if (!channel?.isTextBased() || !channel?.isSendable()) {
    await replyMessage(
      interaction,
      'Operação inválida!',
      'Não é possível enviar mensagem neste canal!',
    );
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`Bem-vindo(a) ao ${interaction.guild?.name}!`)
    .setDescription(
      'Olá! Para garantir um lugar seguro e exclusivo, precisamos verificar sua identidade.\n\n' +
        'Clique em `Iniciar` para continuar.\n\n' +
        'Caso tenha alguma dúvida ou dificuldade, entre em contato conos em `Ajuda`.',
    )
    .setColor(ShoppService.colors.globogamers)
    .setThumbnail(interaction.guild!.iconURL())
    .setColor(ShoppService.colors.globogamers);

  const start = new ButtonBuilder()
    .setCustomId('button_reception_start')
    .setLabel('Iniciar')
    .setStyle(ButtonStyle.Success)
    .setEmoji({ name: '✅' });

  const help = new ButtonBuilder()
    .setCustomId('button_reception_help')
    .setLabel('Ajuda')
    .setStyle(ButtonStyle.Success)
    .setEmoji({ name: '❓' });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(start, help);

  console.log(`Enviando mensagem no canal ${channel.name}.`);
  await channel.send({ embeds: [embed], components: [row] });
}
