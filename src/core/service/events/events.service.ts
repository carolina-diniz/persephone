import { client } from '../../../apis';
import { GuildAvailable, Ready } from '../../events';

export const EventsService = {
  listen: () => {
    client.once('ready', Ready).on('guildAvailable', GuildAvailable);
  },
};
