const itemTypeKeys = [
  "HELMET",
  "CHESTPLATE",
  "LEGGINGS",
  "BOOTS",
  "SWORD",
  "DICE",
  "SHIELD",
  "TOME",
  "SCROLL",
  "SHARD",
  "CARD",
  "KEY",
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
