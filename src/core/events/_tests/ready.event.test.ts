import { Client } from 'discord.js';

jest.mock('discord.js', () => {
  const originalModule = jest.requireActual('discord.js');

  return {
    ...originalModule,
    Client: jest.fn().mockImplementation(() => {
      return {
        once: jest.fn(),
      };
    }),
  };
});

describe('onReady', () => {
  let mockClient: Client<true>;

  beforeEach(() => {
    mockClient = new Client({ intents: [] }) as Client<true>;
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should verify that the Client constructor is called with the correct intents', () => {
    new Client({ intents: [] });
    expect(Client).toHaveBeenCalledWith({ intents: [] });
  });
});
