export type BotClient = Client & {
  commands: Collection<unknown, unknown>;
};

export type BaseInteraction = BaseInteraction & {
  client: {
    commands: BotClient;
  };
};

export type Command = {
  default: {
    data: SlashCommandBuilder;
    execute(interaction: BaseInteraction): Promise<void>;
    autocomplete(interaction: BaseInteraction): Promise<void>;
  };
};

export type ServerModel = {
  serverId: string;
  enchantments: Map<
    string,
    {
      gear: string[];
      level: string;
      price: string;
    }
  >;
};
