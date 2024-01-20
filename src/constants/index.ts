export const MAX_AUTOCOMPLETE_OPTIONS = 25;
export const ENCHANTMENTS_FILE_PATH = 'src/enchantments.json';
export const GEAR_TYPE_DELIMITER = ',';
export const EMBED_COLOR = '#17DD62';
export const COMMANDS = {
  enchantments: 'enchantments',
  forge: 'forge',
  price: 'price',
  remove: 'remove',
  enchantment: 'enchantment',
};
export const INPUT_OPTIONS = {
  gear: 'gear',
  enchantment: 'enchantment',
  price: 'price',
  level: 'level',
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
  'Hammer',
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
    name: 'Hammer',
    values: ['hammer'],
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
