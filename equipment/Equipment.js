/**
 * Represents a set of equipment for an entity.
 */
class Equipment {
  constructor() {
    this.helmet = null;
    this.chestplate = null;
    this.leggings = null;
    this.boots = null;
    this.weapon = null;
    this.secondary = null;
    this.talisman = null;
  }

  /**
   * Equips an equipable to a specific slot on the entity. If an equipable is already equipped
   * in that slot, it will be unequipped and added to the entity's inventory.
   *
   * @param {Object} entity - The entity that is equipping the equipable.
   * @param {Object} equipable - The equipable to be equipped. Must contain an `equipSlot` property
   * and `onEquip`/`onUnequip` methods.
   * @return {void} This method does not return a value.
   */
  equipItem(entity, equipable) {
    const slot = equipable.equipSlot;

    if (this[slot]) {
      this.unequipItem(entity, this[slot]);
    }

    this[slot] = equipable;
    equipable.onEquip(entity);
  }

  /**
   * Unequips the specified item from the given entity and adds it back to the entity's inventory.
   *
   * @param {Object} entity - The entity from which the item will be unequipped. It should have an inventory object.
   * @param {Object} equipable - The item to be unequipped. This should be an equipable object with an `onUnequip` method.
   * @return {void} This method does not return a value, but it modifies the entity's inventory and triggers the unequip behavior of the item.
   * @throws {Error} Throws an error if the item cannot be added back to the entity's inventory.
   */
  unequipItem(entity, equipable) {
    const success = entity.inventory.addItem(equipable);
    if (!success) {
      throw new Error("Failed to add item to inventory");
    }
    else {
      equipable.onUnequip(entity);
    }
  }
}
