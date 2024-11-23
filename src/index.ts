import { discordApi } from './apis';
import { EventsService } from './core/service';

console.clear();
console.log('Persephone is awakening...');

(async () => {
  await discordApi.connect();
  await EventsService.listen();
})();
