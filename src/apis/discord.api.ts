import { Client, IntentsBitField } from "discord.js";
import "dotenv/config";

const client = new Client({
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
      console.log("Conectando ao Discord...");

      await client.login(process.env.DISCORD_TOKEN);

      console.log("Conectado ao Discord!");

      return client;
    } catch (error) {
      console.error("Error ao conectar ao discord: \n", error);
      return undefined;
    }
  },
  client,
};
