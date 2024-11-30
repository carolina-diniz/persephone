import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import 'dotenv/config';
import { replyMessage } from '../../../../core/service';

export async function execute(interaction: ButtonInteraction): Promise<void> {
  const [userField, nameField, emailField] = interaction.message.embeds[0].fields;

  const user = {
    id: userField.value.replace(/\D/g, ''),
    name: nameField.value,
    email: emailField.value,
  };

  const member = interaction.guild?.members.resolve(user.id);
  const entryRole = interaction.guild?.roles.resolve(process.env.ENTRY_ROLE_ID!);

  if (entryRole && member) {
    try {
      await member.roles.add(entryRole);

      const embed = new EmbedBuilder(interaction.message.embeds[0].data);
      embed
        .setTitle('ACESSO APROVADO')
        .setColor('Green')
        .setFooter({
          text: `Aprovado por ${interaction.user.displayName}`,
        });

      await interaction.update({ embeds: [embed], components: [] });
    } catch (error) {
      await interaction.deferReply({ ephemeral: true });
      await replyMessage(interaction, 'ERROR AO AVPROVAR');
    }
    return;
  }
}
