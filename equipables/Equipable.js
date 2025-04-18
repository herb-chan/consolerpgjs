import EquipableSlots from "./EquipableSlots.js";
import Item from "../items/Item.js";

export default class Equipable extends Item {
  constructor({
    name,
    quantity = 1,
    description = "",
    rarity = ItemRarities.COMMON,
    type = ItemTypes.MISCELLANEOUS,
    stats = {},
    equipSlot = null,
  }) {
    super({ name, quantity, description, rarity, type, stats });

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
