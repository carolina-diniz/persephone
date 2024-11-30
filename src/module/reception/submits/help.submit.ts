import { ModalSubmitInteraction } from 'discord.js';
import 'dotenv/config';
import { CharacterService, replyMessage, sendMessage } from '../../../core/service';

export async function execute(interaction: ModalSubmitInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const input_name = interaction.fields.getTextInputValue('input_reception_name');
  const input_doubt = interaction.fields.getTextInputValue('input_reception_doubt');

  const name = CharacterService.titleCase(input_name);

  const channelId = process.env.CHANNEL_SUPPORT_ID!;

  await sendMessage(interaction, channelId, 'SUPORTE - AGUARDANDO', {
    name,
    doubt: input_doubt,
  });

  await replyMessage(
    interaction,
    'Solicitação de ajuda enviada com sucesso!',
    'Um administrador irá revisar suas informações e entrará em contato em breve para lhe ajudar.',
  );
}
