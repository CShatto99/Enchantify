export const MAX_AUTOCOMPLETE_OPTIONS = 25;
export const ENCHANTMENTS_FILE_PATH = 'src/enchantments.json';
export const GEAR_TYPE_DELIMITER = ',';
export const EMBED_COLOR = '#17DD62';
export const AVERAGE_ANVIL_DURABILITY = 25;
export const COMMANDS = {
  enchantment: 'enchantment',
  enchantments: 'enchantments',
  forge: 'forge',
  invite: 'invite',
  price: 'price',
  register: 'register',
  remove: 'remove',
};
export const INPUT_OPTIONS = {
  gear: 'gear',
  enchantment: 'enchantment',
  price: 'price',
  level: 'level',
  organize: 'organize',
};
export const LINKS = {
  invite:
    'https://discord.com/api/oauth2/authorize?client_id=1197698797048967178&permissions=2147552256&scope=bot',
  github: 'https://github.com/CShatto99/Enchantify',
  anvilDurability:
    'https://minecraft.fandom.com/wiki/Anvil#:~:text=An%20anvil%20typically%20survives%20for,the%20number%20of%20blocks%20fallen',
};
export const ENCHANTMENT_LEVELS: { [key: string]: number } = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
};
export const GEAR_TYPES = [
  'Helmet',
  'Chest',
  'Legs',
  'Boots',
  'Weapon',
  'Trident',
  'Shield',
  'Bow',
  'Crossbow',
  'Pickaxe',
  'Axe',
  'Shovel',
  'Hoe',
  'Fishing Pole',
  'Shears',
  'Weapon',
];
export const GEAR_OPTIONS = [
  {
    name: 'Helmet',
    values: ['helmet', 'head', 'hat', 'hood'],
  },
  {
    name: 'Chest',
    values: [
      'chest',
      'chestplate',
      'chestpiece',
      'chest plate',
      'chest piece',
      'body',
      'breastplate',
    ],
  },
  {
    name: 'Legs',
    values: ['legs', 'leggings', 'pants'],
  },
  {
    name: 'Boots',
    values: ['boots', 'boot', 'feet', 'foot', 'shoe', 'shoes'],
  },
  {
    name: 'Weapon',
    values: ['weapon', 'sword'],
  },
  {
    name: 'Trident',
    values: ['trident'],
  },
  {
    name: 'Shield',
    values: ['shield'],
  },
  {
    name: 'Bow',
    values: ['bow'],
  },
  {
    name: 'Crossbow',
    values: ['crossbow'],
  },
  {
    name: 'Pickaxe',
    values: ['pickaxe', 'pick'],
  },
  {
    name: 'Axe',
    values: ['axe'],
  },
  {
    name: 'Shovel',
    values: ['shovel'],
  },
  {
    name: 'Hoe',
    values: ['hoe'],
  },
  {
    name: 'Fishing Pole',
    values: ['fishing pole', 'fishingpole', 'fishing', 'pole'],
  },
  {
    name: 'Shears',
    values: ['shears', 'shear'],
  },
];
export const FEEDBACK = {
  serverNotFound: `❌ Server not found, try registering the server with the \`/${COMMANDS.register}\` command`,
  unsupportedGear: `❌ Unsupported gear type provided, supported gear types: \`${GEAR_OPTIONS.map(gearOption => gearOption.name).join(', ')}\``,
  noEnchantments: `🔍 No enchantments found, try adding one to your library with the \`/${COMMANDS.enchantment}\` command`,
  enchantmentNotFound: (enchantment: string) =>
    `❌ Enchantment \`${enchantment}\` is not in your library, try a different enchantment or add it to your library with the \`/${COMMANDS.enchantment}\` command`,
  levelOutOfRange: (enchantment: string, startLevel: string) =>
    `ℹ️ The entered level must be greater than the ${enchantment} level in your library (${enchantment} ${startLevel})`,
};
