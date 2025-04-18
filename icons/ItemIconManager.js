import ICON_MAP from "./IconMap.js";
import ICON_MODES from "./IconModes.js";

let currentMode = ICON_MODES.FONT;

class ItemIconManager {
  static setMode(mode) {
    if (!Object.values(ICON_MODES).includes(mode)) {
      throw new Error(`Invalid icon mode: ${mode}`);
    }
    currentMode = mode;
  }

  static getMode() {
    return currentMode;
  }

  static getIcon(type) {
    const icons = ICON_MAP[type];
    if (!icons) return "?";
    return icons[currentMode] || "?";
  }

  static get MODES() {
    return ICON_MODES;
  }
}

export default ItemIconManager;
