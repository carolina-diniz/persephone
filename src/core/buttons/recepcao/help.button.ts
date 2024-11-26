import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export async function execute(interaction: ButtonInteraction) {
  const modal = new ModalBuilder()
    .setCustomId('modal_reception_help')
    .setTitle('Confirmação de Identidade');

  const name = new TextInputBuilder()
    .setCustomId('input_reception_name')
    .setLabel('Nome completo')
    .setPlaceholder('Digite seu nome completo')
    .setMaxLength(64)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const doubt = new TextInputBuilder()
    .setCustomId('input_reception_doubt')
    .setLabel('Escreva sua dúvida')
    .setPlaceholder('Descreva aqui o que está acontecendo')
    .setRequired(true)
    .setMaxLength(2000)
    .setStyle(TextInputStyle.Paragraph);

  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(name);
  const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(doubt);

  modal.addComponents(row1, row2);
  console.log('Abrindo modal para interação:', interaction.customId);

  await interaction.showModal(modal);
}
