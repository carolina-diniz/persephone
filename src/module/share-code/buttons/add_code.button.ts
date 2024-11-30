import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { staticInfos } from '../../../core/commands/share-code';
import { CharacterService } from '../../../core/service';

export async function execute(interaction: ButtonInteraction): Promise<void> {
  const plataformName = interaction.message.embeds[0].author?.name;
  console.log(plataformName)
  const plataform = staticInfos.find((plataform) => plataform.title === plataformName)

  const modal = new ModalBuilder()
    .setCustomId('modal_share_code')
    .setTitle(`${plataform?.title} - ${plataform?.codeName}`);

  const input_code = new TextInputBuilder()
    .setCustomId('input_share_code')
    .setLabel('Código')
    .setPlaceholder(`Digite o seu ${CharacterService.titleCase(plataform?.codeName || '')}`)
    .setMaxLength(32)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(input_code);

  modal.addComponents(row1);

  await interaction.showModal(modal);
}
