import chalk from "chalk";

export default class ColorUtils {
  static rarityColors = {
    COMMON: chalk.white,
    UNCOMMON: chalk.green,
    RARE: chalk.blue,
    EPIC: chalk.magenta,
    LEGENDARY: chalk.yellow,
    RELIC: chalk.magentaBright,
  };

  static statColors = {
    health: chalk.red,
    attack: chalk.yellow,
    defense: chalk.green,
    experience: chalk.green,
    level: chalk.magenta,
  };

  static colorRarity(rarity, text) {
    const color = this.rarityColors[rarity] || chalk.gray;
    return color(text);
  }

  static colorStat(stat, value) {
    const color = this.statColors[stat] || chalk.white;
    return color(value);
  }

  static boldStat(stat, value) {
    const color = this.statColors[stat] || chalk.white;
    return chalk.bold(color(value));
  }
}
