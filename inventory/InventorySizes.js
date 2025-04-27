/**
 * Enum-like object representing the maximum inventory sizes for different container types.
 * The object is frozen, meaning it cannot be modified after its creation.
 *
 * @type {Readonly<{ENTITY: number, SMALL_TREASURE_CHEST: number, MEDIUM_TREASURE_CHEST: number, BIG_TREASURE_CHEST: number}>}
 */
const InventorySizes = Object.freeze({
  ENTITY: 20,
  SMALL_TREASURE_CHEST: 20,
  MEDIUM_TREASURE_CHEST: 30,
  BIG_TREASURE_CHEST: 40,
});

export default InventorySizes;
