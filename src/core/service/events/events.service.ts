import { client } from '../../../apis';
import { GuildAvailable, InteractionCreate, Ready } from '../../events';

export const EventsService = {
  listen: () => {
    client
      .once('ready', Ready)
      .on('guildAvailable', GuildAvailable)
      .on('interactionCreate', InteractionCreate);
  },
};
