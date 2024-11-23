import { SlashCommandBuilder } from "discord.js";

export interface CommandData {
  data: SlashCommandBuilder,
  execute: object,
}
