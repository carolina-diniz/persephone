import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageCreateOptions,
  ModalSubmitInteraction,
} from 'discord.js';
import {
  Auth,
  CharacterService,
  sendEmail,
  ShoppService,
  ValidateEmailService,
} from '../../service';

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

  await replyMessage(interaction, title, description);
}

async function validGloboEmail(interaction: ModalSubmitInteraction, name: string, email: string) {
  console.log(`Email globo válido: ${email}`);

  await sendCodeToEmail(interaction.user.id, name, email);

  const title = 'Complete Sua Verificação';
  const description = `${name}, você receberá um código com 6 números no seu e-mail. Após recebê-lo, clique no botão abaio para confirmar seu código e concluir o processo de verificação.`;

  const codeButton = new ButtonBuilder()
    .setCustomId('button_reception_code')
    .setLabel('Confirmar Código')
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(codeButton);

  replyMessage(interaction, title, description, row);

  await sendMessageInApproveChannel(interaction, 'AGUARDANDO APROVAÇÃO POR E-MAIL', {
    name,
    email,
  });
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

  replyMessage(interaction, title, description);

  await sendMessageInApproveChannel(interaction, 'AGUARDANDO APROVAÇÃO MANUAL', { name, email });
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

async function replyMessage(
  interaction: ModalSubmitInteraction,
  title: string,
  description: string,
  row?: ActionRowBuilder<ButtonBuilder>,
): Promise<void> {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(ShoppService.colors.globogamers);

  await interaction.editReply({ embeds: [embed], components: row ? [row] : [] }).then(() => {
    console.log('message replied successfully');
    setTimeout(
      async () => {
        await Auth.delete(interaction.user.id);
        await interaction.deleteReply().catch(console.error);
      },
      1000 * 60 * 5,
    );
  });
}

async function sendMessageInApproveChannel(
  interaction: ModalSubmitInteraction,
  title: string,
  fields: {
    name: string;
    email?: string;
    doubt?: string;
  },
) {
  const channel = await interaction.guild?.channels.resolve(process.env.CHANNEL_APPROVE_ID!);
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
      const aprovar: ButtonBuilder = new ButtonBuilder()
        .setCustomId('button_reception_approve')
        .setLabel('Aprovar')
        .setStyle(ButtonStyle.Success);

      const reprovar: ButtonBuilder = new ButtonBuilder()
        .setCustomId('button_reception_reprove')
        .setLabel('Reprovar')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(aprovar, reprovar);

      messageOptions['components'] = [row];
    }
  }
  if (doubt) {
    embed.addFields({ name: 'Dúvida', value: `${doubt}`, inline: false });
  }

  if (!channel?.isSendable()) return;

  console.log(`Enviando mensagem no canal ${channel.name}.`);

  messageOptions['embeds'] = [embed];

  await channel.send(messageOptions);
}
