const itemRarityKeys = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "EPIC",
  "LEGENDARY",
  "RELIC",
];

export const ItemRarities = Object.freeze(
  Object.fromEntries(itemRarityKeys.map((key) => [key, key]))
);

export const ItemRaritiesDisplay = Object.freeze(
  Object.fromEntries(
    itemRarityKeys.map((key) => [
      key,
      key.charAt(0) + key.slice(1).toLowerCase(),
    ])
  )
);
