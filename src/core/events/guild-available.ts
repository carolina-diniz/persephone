import { Guild } from "discord.js";
import { client } from "../../apis";
import { deployCommands } from "../service";

export async function GuildAvailable(guild: Guild) {
  await deployCommands(client.user!.id, guild.id)
}
