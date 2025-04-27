/**
 * An immutable object that defines the various equipable slots available for a character or item in a system.
 * The slots represent specific areas where equipment can be placed or equipped.
 *
 * @type {Readonly<{HELMET: string, CHESTPLATE: string, LEGGINGS: string, BOOTS: string, WEAPON: string, SECONDARY: string, TALISMAN: string}>}
 */
const EquipableSlots = Object.freeze({
  HELMET: "helmet",
  CHESTPLATE: "chestplate",
  LEGGINGS: "leggings",
  BOOTS: "boots",
  WEAPON: "weapon",
  SECONDARY: "secondary",
  TALISMAN: "talisman",
});

export default EquipableSlots;
