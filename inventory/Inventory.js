import InventorySizes from "./InventorySizes.js";
import InventoryError from 'inventory/InventoryError.js';

import Item from "../items/Item.js";

/**
 * Represents an inventory system with a fixed number of slots.
 */
class Inventory {
  constructor(size) {
    if (!Object.values(InventorySizes).includes(size)) {
      throw new InventoryError(`Invalid inventory size: "${size}"`, {
        invalidValue: size,
        expectedValues: Object.values(InventorySizes),
      });
    }

    this.size = size;
    this.items = Array(size).fill(null);
  }

  /**
   * Adds an item to the inventory if there is an available slot.
   *
   * @param {Item} item - The item to be added to the inventory. Must be an instance of the `Item` class.
   * @return {boolean} Returns `true` if the item was successfully added, or `false` if there are no available slots.
   * @throws {InventoryError} Throws an error if the provided item is not an instance of the `Item` class.
   */
  addItem(item) {
    if (!item instanceof Item) {
      throw new InventoryError(`Invalid item: ${item}`, {
        invalidValue: item,
        expectedValues: [Item],
      });
    }

    const emptyIndex = this.items.findIndex(slot => slot === null);

    if (emptyIndex === -1) {
      return false;
    }

    this.items[emptyIndex] = item;
    return true;
  }
}
