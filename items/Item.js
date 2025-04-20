import chalk from "chalk";

import ColorUtils from "../utils/ColorUtils.js";

import { ItemCategories, ItemCategoriesDisplay } from "./ItemCategories.js";
import { ItemRarities, ItemRaritiesDisplay } from "./ItemRarities.js";
import ItemError from "./ItemError.js";
import ItemIconManager from "../icons/ItemIconManager.js";

export default class Item {
  constructor({
    name,
    quantity = 1,
    description = "",
    rarity = ItemRarities.COMMON,
    category = ItemCategories.MISCELLANEOUS,
    stats = {},
  }) {
    if (!Object.values(ItemCategories).includes(category)) {
      throw new ItemError(`Invalid item category: "${category}"`, {
        invalidValue: category,
        expectedValues: Object.values(ItemCategories),
      });
    }

    if (!Object.values(ItemRarities).includes(rarity)) {
      throw new ItemError(`Invalid item rarity: "${rarity}"`, {
        invalidValue: rarity,
        expectedValues: Object.values(ItemRarities),
      });
    }

    this.name = name;
    this.quantity = quantity;
    this.description = description;
    this.rarity = rarity;
    this.category = category;
    this.stats = stats;
  }

  use() {
    console.log(`Used ${this.name}`);
  }

  getDisplayIcon() {
    const icon = ItemIconManager.getIcon(this.category);
    return ColorUtils.colorRarity(this.rarity, icon);
  }

  getDisplayName() {
    return ColorUtils.colorRarity(this.rarity, chalk.bold(this.name));
  }

  getRarityDisplay() {
    return ItemRaritiesDisplay[this.rarity];
  }

  getCategoryDisplay() {
    return ItemCategoriesDisplay[this.category];
  }

  getStatsAsString() {
    const entries = Object.entries(this.stats);
    if (entries.length === 0) return null;

    return entries
      .map(
        ([key, value]) =>
          `${value > 0 ? "+" : ""}${value} ${ColorUtils.colorStat(key, key)}`
      )
      .join(", ");
  }
}
