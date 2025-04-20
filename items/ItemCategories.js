const itemCategoryKeys = [
  "EQUIPABLE",
  "CONSUMABLE",
  "QUEST",
  "MATERIAL",
  "MISCELLANEOUS",
];

export const ItemCategories = Object.freeze(
  Object.fromEntries(itemCategoryKeys.map((key) => [key, key]))
);

export const ItemCategoriesDisplay = Object.freeze(
  Object.fromEntries(
    itemCategoryKeys.map((key) => [
      key,
      key.charAt(0) + key.slice(1).toLowerCase(),
    ])
  )
);
