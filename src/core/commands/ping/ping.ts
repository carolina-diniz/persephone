import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Ping the bot');

export async function execute(interaction: CommandInteraction): Promise<void> {
  const embed = new EmbedBuilder().setTitle('Ping the bot').setDescription('Pong!');
  await interaction.reply({ embeds: [embed] });
}
