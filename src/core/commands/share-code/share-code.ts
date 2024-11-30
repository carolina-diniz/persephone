import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { ButtonStyle, CommandInteraction } from 'discord.js';

type StaticInfos = {
  title: string;
  name: string;
  logo: string;
  codeName: string;
}[];

export const staticInfos: StaticInfos = [
  {
    title: 'Steam',
    name: 'steam',
    logo: 'https://media.discordapp.net/attachments/1264017504079188058/1310838150695882753/png-clipart-brand-logo-steam-gump-s.png',
    codeName: 'Códigos de Amigos',
  },
  {
    title: 'Epic Games',
    name: 'epicgames',
    logo: 'https://logospng.org/download/epic-games/epic-games-256.png',
    codeName: 'Display Name',
  },
  {
    title: 'Nintendo Switch',
    name: 'nintendoswitch',
    logo: 'https://media.discordapp.net/attachments/1264017504079188058/1312479260593754223/nintendo-switch-seeklogo.png',
    codeName: 'Friend Code',
  },
  {
    title: 'Xbox',
    name: 'xbox',
    logo: 'https://logospng.org/download/xbox/logo-xbox-256.png',
    codeName: 'Gamertag',
  },
  {
    title: 'PlayStation',
    name: 'playstation',
    logo: 'https://logospng.org/download/playstation-1/ps1-playstation-1-256.png',
    codeName: 'Online ID',
  },
  {
    title: 'Battle.net',
    name: 'battlenet',
    logo: 'https://media.discordapp.net/attachments/1264017504079188058/1312479720570491062/pngwing.com.png',
    codeName: 'BattleTag',
  },
  {
    title: 'Riot Games',
    name: 'riotgames',
    logo: 'https://logospng.org/download/riot-games/riot-games-256.png',
    codeName: 'RIOT ID',
  },
  {
    title: 'Pokémon Go',
    name: 'pokemongo',
    logo: 'https://lh3.googleusercontent.com/3TSaKxXGo2wT0lu0AyNUBnkk6wkCC2AzOhJyy3JXIPm-AmZ1k9DSAroWeBUyePswCZSs5lVp3mPF7HzUpY9VPlyOV5eddITONINr3WSqLNLm=e365-w512',
    codeName: 'Friend Code',
  },
  {
    title: 'Pokémon TCG Pocket',
    name: 'pokemontcg',
    logo: 'https://media.discordapp.net/attachments/1264017504079188058/1312479260258078810/tcgpocketlogo_ptbr.png',
    codeName: 'Friend Code',
  }
];

export const data = new SlashCommandBuilder()
  .setName('share_code_setup')
  .setDescription('Configure seu código de amigo')
  .addStringOption(
    new SlashCommandStringOption()
      .setName('plataforma')
      .setDescription('Escolha a plataforma')
      .setRequired(true)
      .setChoices(
        staticInfos.map((plataform) => {
          return {
            name: plataform.title,
            value: plataform.name,
          };
        }),
      ),
  );

export async function execute(interaction: CommandInteraction): Promise<void> {
  await interaction.deferReply();

  const { channel } = interaction;

  const plataform = interaction.options.get('plataforma')?.value!.toString();

  if (!plataform) {
    await interaction.editReply('Você não escolheu a plataforma!');
    return;
  }

  const plataformInfo = staticInfos.find((info) => info.name === plataform);

  if (channel?.isSendable() && plataformInfo) {
    const embed = new EmbedBuilder()
      .setTitle(plataformInfo.codeName)
      .setAuthor({ name: plataformInfo.title })
      .setThumbnail(plataformInfo.logo);

    const add_code = new ButtonBuilder()
      .setCustomId('button_share_code_add_code')
      .setLabel('Add meu código')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(add_code);

    await channel.send({ embeds: [embed], components: [row] });
  }

  await interaction.deleteReply();
}
