import chalk from "chalk";

/**
 * Utility class for handling color formatting related to rarity and stats using the chalk library.
 */
export default class ColorUtils {
  /**
   * Maps item rarity levels to specific chalk color functions.
   * Used for consistent color formatting based on item rarity.
   *
   * @type {Object<string, function(string): string>}
   */
  static rarityColors = {
    COMMON: chalk.white,
    UNCOMMON: chalk.green,
    RARE: chalk.blue,
    EPIC: chalk.magenta,
    LEGENDARY: chalk.yellow,
    RELIC: chalk.magentaBright,
  };

  /**
   * Maps stat names to specific chalk color functions.
   * Used for consistent color formatting based on stat type.
   *
   * @type {Object<string, function(string): string>}
   */
  static statColors = {
    health: chalk.red,
    attack: chalk.yellow,
    defense: chalk.green,
    experience: chalk.green,
    level: chalk.magenta,
  };

  /**
   * Assigns a color to a given text based on its rarity level, using a predefined color mapping.
   *
   * @param {string} rarity - The rarity level used to determine the color. It refers to a key in the `rarityColors` mapping.
   * @param {string} text - The text to be styled with the color corresponding to the rarity level.
   * @return {string} A string with the applied color styling. Defaults to gray if the rarity level is not found.
   */
  static colorRarity(rarity, text) {
    const color = this.rarityColors[rarity] || chalk.gray;
    return color(text);
  }

  /**
   * Colors a given stat value based on predefined color mappings.
   *
   * @param {string} stat - The name of the stat to determine the color mapping.
   * @param {string} value - The value to be colored.
   * @return {string} The value formatted with the corresponding color.
   */
  static colorStat(stat, value) {
    const color = this.statColors[stat] || chalk.white;
    return color(value);
  }

  /**
   * Formats a statistical value by styling it in bold and applying a predefined color.
   *
   * @param {string} stat - The name of the statistical category, used to determine the color.
   * @param {string|number} value - The value to be styled and formatted.
   * @return {string} The formatted and styled value as a string.
   */
  static boldStat(stat, value) {
    const color = this.statColors[stat] || chalk.white;
    return chalk.bold(color(value));
  }
}
