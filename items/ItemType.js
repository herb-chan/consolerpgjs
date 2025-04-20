const itemTypeKeys = [
  "HELMET",
  "CHESTPLATE",
  "LEGGINGS",
  "BOOTS",
  "SWORD",
  "DICE",
  "SHIELD",
  "TOMES",
  "SCROLLS",
  "SHARD",
  "CARDS",
  "LOCKPICK",
  "LANTERN",
  "TALISMAN",
  "POTION",
  "SACK",
  "GOLD",
  "RUNE",
];

export const ItemTypes = Object.freeze(
  Object.fromEntries(itemTypeKeys.map((key) => [key, key]))
);
