import Utility from "./Utility";

export default class Entity {
  constructor(name, inventory, equipment, loot) {
    this.name = name;
    this.inventory = inventory || Array(20).fill(null);
    this.equipment = equipment || {
      helmet: null,
      chestplate: null,
      leggings: null,
      boots: null,
      weapon: null,
      secondary: null,
    };
    this.loot = loot || {
      experience: { min: 0, max: 0 },
      gold: { min: 0, max: 0 },
      items: [],
    };
  }

  addItemToInventory(item) {
    const emptySlotIndex = this.inventory.findIndex((slot) => slot === null);
    if (emptySlotIndex !== -1) {
      this.inventory[emptySlotIndex] = item;
    }
  }

  removeItemFromInventory(item) {
    const itemIndex = this.inventory.findIndex((slot) => slot === item);
    if (itemIndex !== -1) {
      this.inventory[itemIndex] = null;
    }
  }

  returnLoot() {
    const experience = Utility.generateRandomNumber(
      this.loot.experience.min,
      this.loot.experience.max
    );
    const gold = Utility.generateRandomNumber(
      this.loot.gold.min,
      this.loot.gold.max
    );

    const items = this.loot.items.filter((item) => {
      const roll = Math.random() * 100;
      return roll <= item.chance;
    });

    return {
      experience,
      gold,
      items: items,
    };
  }
}
