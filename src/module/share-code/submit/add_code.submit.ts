import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';

export async function execute(interaction: ModalSubmitInteraction): Promise<void> {
  await interaction.deferReply();
  const { message, fields, user } = interaction;

  const oldEmbed = message?.embeds[0];
  const oldEmbedDescription = oldEmbed?.description;
  const newEmbed = new EmbedBuilder(oldEmbed!.data);
  const input_code = fields.getTextInputValue('input_share_code');

  if (message && message.editable && input_code) {
    newEmbed.setDescription(`${oldEmbedDescription ?? ''}\n\`${input_code}\`: <@${user.id}>`);

    await message.edit({ embeds: [newEmbed] });
  }

  await interaction.deleteReply();
}
