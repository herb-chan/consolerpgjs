import EquipableSlots from "./EquipableSlots.js";
import Item from "../items/Item.js";
import { ItemCategories } from "../items/ItemCategories.js";
import { ItemRarities } from "../items/ItemRarities.js";

export default class Equipable extends Item {
  constructor({
    name,
    quantity = 1,
    description = "",
    rarity = ItemRarities.COMMON,
    category = ItemCategories.MISCELLANEOUS,
    stats = {},
    equipSlot = null,
  }) {
    super({ name, quantity, description, rarity, category, stats });

    if (!Object.values(EquipableSlots).includes(equipSlot)) {
      throw new ItemError(`Invalid equipable slot: "${equipSlot}"`, {
        invalidValue: equipSlot,
        expectedValues: Object.values(EquipableSlots),
      });
    }

    this.equipSlot = equipSlot;
  }

  canEquip(slot) {
    return this.equipSlot === slot;
  }
}
