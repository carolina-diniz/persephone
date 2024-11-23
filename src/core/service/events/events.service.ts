import { discordApi } from '../../../apis';
import { onReady } from '../../events';

export const EventsService = {
  listen: () => {
    discordApi.client.once('ready', onReady);
  },
};
