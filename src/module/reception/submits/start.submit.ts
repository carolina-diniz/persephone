import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalSubmitInteraction } from 'discord.js';
import {
  Auth,
  CharacterService,
  replyMessage,
  sendEmail,
  sendMessage,
  ValidateEmailService,
} from '../../../core/service';

const timeout = 1000 * 60 * 5;
const CHANNEL_APPROVE_ID = process.env.CHANNEL_APPROVE_ID!;

export async function execute(interaction: ModalSubmitInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const name = CharacterService.titleCase(
    interaction.fields.getTextInputValue('input_reception_name'),
  ).split(' ')[0];
  const email = interaction.fields.getTextInputValue('input_reception_email').toLowerCase();

  const { isValidEmail, isValidGloboDomain } = ValidateEmailService;

  if (!(await isValidEmail(email))) {
    await invalidEmail(interaction);
    return;
  }

  if (await isValidGloboDomain(email)) {
    await validGloboEmail(interaction, name, email);
    return;
  }

  await validNonGloboEmail(interaction, name, email);
}

async function invalidEmail(interaction: ModalSubmitInteraction) {
  const title = 'E-mail inválido';
  const description =
    'O e-mail informado não parece ser válido ou não corresponde ao domínio da Globo. Por favor, verifique se digitou o e-mail corretamente e tente novamente.\n\n' +
    'Caso você esteja usando um e-mail de parceiro ou outro domínio, entre em contato com um administrador para que sua solicitação seja validada manualmente.';

  await replyMessage(interaction, title, description, undefined, timeout);
}

async function validGloboEmail(interaction: ModalSubmitInteraction, name: string, email: string) {
  console.log(`Email globo válido: ${email}`);

  await sendCodeToEmail(interaction.user.id, name, email);

  await sendMessage(interaction, CHANNEL_APPROVE_ID, 'AGUARDANDO APROVAÇÃO POR E-MAIL', {
    name,
    email,
  }).then((message) => {
    Auth.updateMessageId(interaction.user.id, message.id);
  });

  const title = 'Complete Sua Verificação';
  const description = `${name}, você receberá um código com 6 números no seu e-mail. Após recebê-lo, clique no botão abaio para confirmar seu código e concluir o processo de verificação.`;

  const codeButton = new ButtonBuilder()
    .setCustomId('button_reception_code')
    .setLabel('Confirmar Código')
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(codeButton);

  replyMessage(interaction, title, description, row, timeout);
}

async function validNonGloboEmail(
  interaction: ModalSubmitInteraction,
  name: string,
  email: string,
) {
  console.log(`Email válido, mas não globo: ${email}`);

  const title = 'Solicitação enviada com sucesso!';
  const description =
    'Um administrador irá revisar suas informações e entrará em contato em breve para liberar seu acesso.';

  replyMessage(interaction, title, description, undefined, timeout);

  await sendMessage(interaction, CHANNEL_APPROVE_ID, 'AGUARDANDO APROVAÇÃO MANUAL', {
    name,
    email,
  });
}

async function sendCodeToEmail(userId: string, name: string, email: string): Promise<void> {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await Auth.set(userId, { code, messageId: '' });

    const subject = 'Código de Confirmação';
    const text =
      `Olá ${name.split(' ')[0]}, ` +
      `Seu código de verificação é: ${code}\n\n` +
      `Ele expira em 5 minutos. Não o envie para ninguém.\n\n` +
      `Nota: Por favor, não responda este email.`;

    await sendEmail(email, subject, text, code);
  } catch (error) {
    console.error(error);
  }
}
