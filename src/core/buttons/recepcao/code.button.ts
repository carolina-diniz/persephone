import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export async function execute(interaction: ButtonInteraction) {
  const modal = new ModalBuilder()
    .setCustomId('modal_reception_code')
    .setTitle('Código de Verificação');

  const input_code = new TextInputBuilder()
    .setCustomId('input_reception_code')
    .setLabel('Código')
    .setPlaceholder('Digite o código de verificação')
    .setMinLength(6)
    .setMaxLength(6)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(input_code);

  modal.addComponents(row1);

  await interaction
    .showModal(modal)
    .then(() => {
      console.log('Abrindo modal para interação: ', interaction.customId);
    })
    .catch((error) => {
      console.log('Modal não foi aberto');
      console.error(error);
    });
}
