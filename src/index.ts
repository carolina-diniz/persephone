import { discordApi } from "./apis/discord.api";

console.clear();
console.log('Persephone is awakening...');

(async () => {
  await discordApi.connect();
  await discordApi.listenEvents()
})()
