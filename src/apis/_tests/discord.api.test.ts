import { discordApi } from "../discord.api";

jest.mock("discord.js", () => {
  const originalModule = jest.requireActual("discord.js");

  return {
    ...originalModule,
    Client: jest.fn().mockImplementation(() => {
      return {
        login: jest.fn(), // Mock explícito do método login
      };
    }),
    IntentsBitField: originalModule.IntentsBitField,
  };
});

describe("discordApi", () => {
  let mockLogin: jest.Mock;

  beforeEach(() => {
    mockLogin = jest.fn();
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should connect to Discord successfully", async () => {
    mockLogin.mockResolvedValueOnce("mocked-token");

    const client = await discordApi.connect();

    expect(client).toBeDefined();
    expect(client?.login).toHaveBeenCalledTimes(1);
    expect(client?.login).toHaveBeenCalledWith(process.env.DISCORD_TOKEN);
    expect(console.log).toHaveBeenCalledWith("Conectando ao Discord...");
    expect(console.log).toHaveBeenCalledWith("Conectado ao Discord!");
  });
});
