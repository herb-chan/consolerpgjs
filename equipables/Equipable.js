import EquipableSlots from "./EquipableSlots.js";
import Item from "../items/Item.js";
import ItemError from "../items/ItemError.js";
import { ItemCategories } from "../items/ItemCategories.js";
import { ItemRarities } from "../items/ItemRarities.js";

export default class Equipable extends Item {
  constructor({
    name,
    quantity = 1,
    description = "",
    rarity = ItemRarities.COMMON,
    category = ItemCategories.MISCELLANEOUS,
    type,
    stats = {},
    equipSlot = null,
  }) {
    super({name, quantity, description, rarity, category, type, stats});

    if (!Object.values(EquipableSlots).includes(equipSlot)) {
      throw new ItemError(`Invalid equipable slot: "${equipSlot}"`, {
        invalidValue: equipSlot,
        expectedValues: Object.values(EquipableSlots),
      });
    }

    this.equipSlot = equipSlot;
  }

  applyStatistics(entity) {
    for (const [statistic, value] of Object.entries(this.stats)) {
      entity.stats[statistic] += value;
      console.log(`${this.name} applied ${value} to ${statistic}`);
    }
  }

  onEquip(entity) {}

  onUnequip(entity) {}

  onDamage(entity) {}

  onDeath(entity) {}

  onAttack(target) {}
}
