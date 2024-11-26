import { ButtonInteraction, EmbedBuilder } from 'discord.js';

export async function execute(interaction: ButtonInteraction) {
  const embed = new EmbedBuilder(interaction.message.embeds[0].data);

  embed
    .setTitle('ACESSO REPROVADO')
    .setColor('Red')
    .setFooter({
      text: `Reprovado por ${interaction.user.displayName}`,
    });

  await interaction.update({ embeds: [embed], components: [] });
}
