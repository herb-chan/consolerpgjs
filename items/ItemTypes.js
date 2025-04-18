/**
 * @enum {string}
 * @readonly
 * @description
 * Enum-like object representing different item types in the game.
 */
export const ItemTypes = Object.freeze({
  /** A weapon used to deal damage (e.g. swords, bows). */
  WEAPON: "WEAPON",

  /** A piece of armor for protection (e.g. helmet, chestplate). */
  ARMOR: "ARMOR",

  /** An accessory that provides passive bonuses (e.g. rings, amulets). */
  TALISMAN: "TALISMAN",

  /** An item that can be consumed to provide effects (e.g. potions, food). */
  CONSUMABLE: "CONSUMABLE",

  /** A quest-specific item that usually can't be used or equipped. */
  QUEST: "QUEST",

  /** A crafting material or ingredient. */
  MATERIAL: "MATERIAL",

  /** A miscellaneous item that doesn’t fit into the main categories. */
  MISCELLANEOUS: "MISCELLANEOUS",
});

export const ItemTypesDisplay = Object.freeze({
  /** A weapon used to deal damage (e.g. swords, bows). */
  WEAPON: "Weapon",

  /** A piece of armor for protection (e.g. helmet, chestplate). */
  ARMOR: "Armor Piece",

  /** An accessory that provides passive bonuses (e.g. rings, amulets). */
  TALISMAN: "Talisman",

  /** An item that can be consumed to provide effects (e.g. potions, food). */
  CONSUMABLE: "Consumable",

  /** A quest-specific item that usually can't be used or equipped. */
  QUEST: "Quest Item",

  /** A crafting material or ingredient. */
  MATERIAL: "Material",

  /** A miscellaneous item that doesn’t fit into the main categories. */
  MISCELLANEOUS: "Miscellaneous",
});
