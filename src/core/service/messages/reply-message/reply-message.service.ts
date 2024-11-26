import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { Auth } from '../../auth';
import { ShoppService } from '../../shopp';

export async function replyMessage(
  interaction: ModalSubmitInteraction | ButtonInteraction,
  title: string,
  description?: string,
  row?: ActionRowBuilder<ButtonBuilder>,
  timeout?: number,
): Promise<void> {
  const embed = new EmbedBuilder().setTitle(title).setColor(ShoppService.colors.globogamers);

  if (description) {
    embed.setDescription(description);
  }

  await interaction.editReply({ embeds: [embed], components: row ? [row] : [] }).then(() => {
    console.log('message replied successfully');
    if (timeout) {
      setTimeout(async () => {
        await Auth.delete(interaction.user.id);
        await interaction.deleteReply().catch(console.error);
      }, timeout);
    }
  });
}
