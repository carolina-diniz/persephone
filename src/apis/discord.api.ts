import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

export const discordApi = {
  connect: async () => {
    try {
      console.log('Persephone is conneting to Discord...');

      await client.login(process.env.DISCORD_TOKEN);

      console.log('Persephone is conneted!');

      return client;
    } catch (error) {
      console.error('Error to connect to discord: \n', error);
      return undefined;
    }
  }
};
