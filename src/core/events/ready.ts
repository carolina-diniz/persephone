import { Client } from 'discord.js';

export function Ready(client: Client<true>): void {
  console.log('Persephone is ready!');
}
