import chalk from "chalk";

import ColorUtils from "./utils/ColorUtils.js";

import Equipable from "./equipables/Equipable.js";
import EquipableSlots from "./equipables/EquipableSlots.js";
import { ItemCategories } from "./items/ItemCategories.js";
import { ItemRarities } from "./items/ItemRarities.js";
import { ItemTypes } from "./items/ItemType.js";

const WIDTH = 60;
const HEIGHT = 30;
const NUM_ROOMS = 100;
const MIN_ROOM_SIZE = 4;
const MAX_ROOM_SIZE = 12;
const DISTANCE_FROM_OTHER_ROOM = 6;
const USE_CUSTOM_TILES = true;
const DEBUG_MODE = true;

const WALL = {
  isWalkable: false,
  name: "Wall",
  char: USE_CUSTOM_TILES ? "█" : "#",
  color: DEBUG_MODE ? chalk.black : chalk.black,
};

const FLOOR = {
  isWalkable: true,
  name: "Floor",
  char: USE_CUSTOM_TILES ? "█" : "&",
  color: DEBUG_MODE ? chalk.grey : chalk.grey,
};

const TUNNEL = {
  isWalkable: true,
  name: "Tunnel",
  char: USE_CUSTOM_TILES ? "█" : ">",
  color: DEBUG_MODE ? chalk.yellowBright : chalk.grey,
};

const PLAYER = {
  isWalkable: false,
  name: "Player",
  char: USE_CUSTOM_TILES ? "@" : "@",
  color: DEBUG_MODE ? chalk.greenBright : chalk.greenBright,
};

const dungeon = Array.from({length: HEIGHT}, () =>
  Array.from({length: WIDTH}, () => ({...WALL})),
);

const rooms = [];
const validRooms = [];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRoom(x, y, w, h) {
  for (let i = y; i < y + h; i++) {
    for (let j = x; j < x + w; j++) {
      if (i > 0 && i < HEIGHT && j > 0 && j < WIDTH) {
        dungeon[i][j] = {...FLOOR};
      }
    }
  }
}

function center(room) {
  return {
    x: Math.floor(room.x + room.w / 2),
    y: Math.floor(room.y + room.h / 2),
  };
}

function getConnectionPoints(room, toward) {
  const cx = Math.floor(room.x + room.w / 2);
  const cy = Math.floor(room.y + room.h / 2);
  const dx = toward.x - cx;
  const dy = toward.y - cy;

  let entry, start, direction;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      entry = {x: room.x + room.w, y: cy};
      start = {x: entry.x + 1, y: entry.y};
      direction = "right";
    }
    else {
      entry = {x: room.x - 1, y: cy};
      start = {x: entry.x - 1, y: entry.y};
      direction = "left";
    }
  }
  else {
    if (dy > 0) {
      entry = {x: cx, y: room.y + room.h};
      start = {x: entry.x, y: entry.y + 1};
      direction = "down";
    }
    else {
      entry = {x: cx, y: room.y - 1};
      start = {x: entry.x, y: entry.y - 1};
      direction = "up";
    }
  }

  entry.x = Math.max(1, Math.min(WIDTH - 2, entry.x));
  entry.y = Math.max(1, Math.min(HEIGHT - 2, entry.y));
  start.x = Math.max(1, Math.min(WIDTH - 2, start.x));
  start.y = Math.max(1, Math.min(HEIGHT - 2, start.y));

  dungeon[start.y][start.x] = {...TUNNEL};
  pokeIntoRoom(entry, direction);

  return start;
}

function pokeIntoRoom(entry, direction) {
  let poke;
  switch (direction) {
    case "right":
      poke = {x: entry.x - 1, y: entry.y};
      break;
    case "left":
      poke = {x: entry.x + 1, y: entry.y};
      break;
    case "down":
      poke = {x: entry.x, y: entry.y - 1};
      break;
    case "up":
      poke = {x: entry.x, y: entry.y + 1};
      break;
  }
  if (poke && dungeon[poke.y][poke.x]?.isWalkable) {
    dungeon[entry.y][entry.x] = {...TUNNEL};
  }
}

function createHTunnel(x1, x2, y) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    if (dungeon[y]?.[x] && !dungeon[y][x].isWalkable) {
      dungeon[y][x] = {...TUNNEL};
    }
  }
}

function createVTunnel(y1, y2, x) {
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    if (dungeon[y]?.[x] && !dungeon[y][x].isWalkable) {
      dungeon[y][x] = {...TUNNEL};
    }
  }
}

function createPath(from, to) {
  if (Math.random() < 0.5) {
    createHTunnel(from.x, to.x, from.y);
    createVTunnel(from.y, to.y, to.x);
  }
  else {
    createVTunnel(from.y, to.y, from.x);
    createHTunnel(from.x, to.x, to.y);
  }
}

// Room Generation
for (let i = 0; i < NUM_ROOMS; i++) {
  let w = random(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
  let h = random(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
  if (Math.random() < 0.1) {
    w = h = random(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
  }

  const x = random(1, WIDTH - w - 2);
  const y = random(1, HEIGHT - h - 2);
  const newRoom = {x, y, w, h};

  let failed = false;
  for (const other of rooms) {
    if (
      x < other.x + other.w + DISTANCE_FROM_OTHER_ROOM &&
      x + w + DISTANCE_FROM_OTHER_ROOM > other.x &&
      y < other.y + other.h + DISTANCE_FROM_OTHER_ROOM &&
      y + h + DISTANCE_FROM_OTHER_ROOM > other.y
    ) {
      failed = true;
      break;
    }
  }

  if (!failed) {
    createRoom(x, y, w, h);
    rooms.push(newRoom);
    validRooms.push(newRoom);
  }
}

// Connect all rooms
const connected = [validRooms[0]];
const unconnected = validRooms.slice(1);

while (unconnected.length > 0) {
  let bestDist = Infinity,
    fromRoom = null,
    toRoom = null;
  for (const r1 of connected) {
    for (const r2 of unconnected) {
      const c1 = center(r1);
      const c2 = center(r2);
      const dist = Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
      if (dist < bestDist) {
        bestDist = dist;
        fromRoom = r1;
        toRoom = r2;
      }
    }
  }

  const fromStart = getConnectionPoints(fromRoom, center(toRoom));
  const toStart = getConnectionPoints(toRoom, center(fromRoom));
  createPath(fromStart, toStart);
  connected.push(toRoom);
  unconnected.splice(unconnected.indexOf(toRoom), 1);
}

// Place player
const playerRoom = validRooms[random(0, validRooms.length - 1)];
let playerPos = center(playerRoom);
dungeon[playerPos.y][playerPos.x] = {...PLAYER};

// Player state
const playerStats = {
  health: 100,
  attack: 10,
  defense: 5,
  experience: 0,
  level: 1,
};

const inventory = Array(20).fill(null);
const equipment = {
  helmet: null,
  chestplate: null,
  leggings: null,
  boots: null,
  weapon: null,
  secondary: null,
  talisman: null,
};

inventory[0] = new Equipable({
  name: "Helmet of Hairloss",
  quantity: 1,
  description: "Protects your head. Also your chance of dating.",
  rarity: ItemRarities.UNCOMMON,
  category: ItemCategories.EQUIPABLE,
  stats: {defense: 8},
  type: ItemTypes.HELMET,
  equipSlot: EquipableSlots.HELMET,
});

inventory[1] = new Equipable({
  name: "Cursed Rubber Chicken",
  quantity: 1,
  description: "Technically a weapon. Spiritually, a mistake.",
  rarity: ItemRarities.LEGENDARY,
  category: ItemCategories.EQUIPABLE,
  stats: {attack: 15, defense: -2},
  type: ItemTypes.SWORD,
  equipSlot: EquipableSlots.WEAPON,
});

// Mode state
let inventoryMode = false;
let inventoryIndex = 0;
const inventoryCols = 5;
const inventoryRows = 4;

let equipmentMode = false;
let equipmentIndex = 0;
const equipmentSlots = Object.keys(equipment);

function renderDungeon() {
  // console.clear();

  for (let y = 0; y < HEIGHT; y++) {
    let line = "";

    // Render dungeon row
    for (let x = 0; x < WIDTH; x++) {
      line += dungeon[y][x].color(dungeon[y][x].char);
    }

    // Player stats
    if (y === 2) {
      line += `   Health: ${ColorUtils.colorStat(
        "health",
        playerStats.health,
      )}`;
    }
    if (y === 3) {
      line += `   Attack: ${ColorUtils.colorStat(
        "attack",
        playerStats.attack,
      )}`;
    }
    if (y === 4) {
      line += `   Defense: ${ColorUtils.colorStat(
        "defense",
        playerStats.defense,
      )}`;
    }
    if (y === 5) {
      line += `   Experience: ${ColorUtils.colorStat(
        "experience",
        playerStats.experience,
      )}`;
    }
    if (y === 6) {
      line += `   Level: ${ColorUtils.colorStat("level", playerStats.level)}`;
    }

    if (y === 8) {
      const helmet = equipment.helmet
        ? `[${equipment.helmet.getDisplayIcon()}]`
        : "[ ]";
      const label =
        equipmentMode && equipmentIndex === 0
          ? chalk.underline(helmet)
          : helmet;
      line += `   Helmet: ${label}`;
    }
    if (y === 9) {
      const chestplate = equipment.chestplate
        ? `[${equipment.chestplate.getDisplayIcon()}]`
        : "[ ]";
      const label =
        equipmentMode && equipmentIndex === 1
          ? chalk.underline(chestplate)
          : chestplate;
      line += `   Chestplate: ${label}`;
    }
    if (y === 10) {
      const leggings = equipment.leggings
        ? `[${equipment.leggings.getDisplayIcon()}]`
        : "[ ]";
      const label =
        equipmentMode && equipmentIndex === 2
          ? chalk.underline(leggings)
          : leggings;
      line += `   Leggings: ${label}`;
    }
    if (y === 11) {
      const boots = equipment.boots
        ? `[${equipment.boots.getDisplayIcon()}]`
        : "[ ]";
      const label =
        equipmentMode && equipmentIndex === 3 ? chalk.underline(boots) : boots;
      line += `   Boots: ${label}`;
    }
    if (y === 12) {
      const weapon = equipment.weapon
        ? `[${equipment.weapon.getDisplayIcon()}]`
        : "[ ]";
      const label =
        equipmentMode && equipmentIndex === 4
          ? chalk.underline(weapon)
          : weapon;
      line += `   Weapon: ${label}`;
    }
    if (y === 13) {
      const secondary = equipment.secondary
        ? `[${equipment.secondary.getDisplayIcon()}]`
        : "[ ]";
      const label =
        equipmentMode && equipmentIndex === 5
          ? chalk.underline(secondary)
          : secondary;
      line += `   Secondary: ${label}`;
    }
    if (y === 14) {
      const talisman = equipment.talisman
        ? `[${equipment.talisman.getDisplayIcon()}]`
        : "[ ]";
      const label =
        equipmentMode && equipmentIndex === 6
          ? chalk.underline(talisman)
          : talisman;
      line += `   Talisman: ${label}`;
    }

    // Inventory label
    if (y === 16) {
      line += `   Inventory:`;
    }

    // Inventory grid (4 rows)
    if (y >= 18 && y < 22) {
      const row = y - 18;
      const slots = inventory.slice(
        row * inventoryCols,
        row * inventoryCols + inventoryCols,
      );

      const invLine = slots
      .map((item, i) => {
        const idx = row * inventoryCols + i;
        let label = item ? item.getDisplayIcon() : " ";
        if (idx === inventoryIndex && inventoryMode) {
          label = chalk.underline(label);
        }
        return `[${label}]`;
      })
      .join(" ");

      line += `   ${invLine}`;
    }

    const selectedItem = inventoryMode
      ? inventory[inventoryIndex]
      : equipmentMode
        ? equipment[equipmentSlots[equipmentIndex]]
        : null;

    if (selectedItem) {
      if (y === 23) {
        line += `   ${selectedItem.getDisplayName()}`;
      }

      if (y === 24 && selectedItem.description) {
        line += `   ${selectedItem.description}`;
      }

      if (y === 25) {
        const statsText = selectedItem.getStatsAsString?.();
        if (statsText) {
          line += `   ${statsText}`;
        }
        else {
          const itemRarity = selectedItem.rarity.toUpperCase();
          const rarityText = `${selectedItem.getRarityDisplay()} ${selectedItem.getCategoryDisplay()}`;
          line += `   ${ColorUtils.colorRarity(itemRarity, rarityText)}`;
        }
      }

      if (y === 26) {
        const statsText = selectedItem.getStatsAsString?.();
        if (statsText) {
          const itemRarity = selectedItem.rarity.toUpperCase();
          const rarityText = `${selectedItem.getRarityDisplay()} ${selectedItem.getCategoryDisplay()}`;
          line += `   ${ColorUtils.colorRarity(itemRarity, rarityText)}`;
        }
      }
    }

    console.log(line);
  }
}

let previousTile = {...FLOOR};

function movePlayer(dx, dy) {
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;
  const destination = dungeon[newY]?.[newX];

  if (destination && destination.isWalkable) {
    dungeon[playerPos.y][playerPos.x] = {...previousTile};
    previousTile = {...destination};
    playerPos.x = newX;
    playerPos.y = newY;
    dungeon[playerPos.y][playerPos.x] = {...PLAYER};
    renderDungeon();
  }
}

function moveInventory(dx, dy) {
  const col = inventoryIndex % inventoryCols;
  const row = Math.floor(inventoryIndex / inventoryCols);
  let newRow = row + dy;
  let newCol = col + dx;
  newRow = Math.max(0, Math.min(inventoryRows - 1, newRow));
  newCol = Math.max(0, Math.min(inventoryCols - 1, newCol));
  inventoryIndex = newRow * inventoryCols + newCol;
  renderDungeon();
}

function moveEquipment(dy) {
  equipmentIndex += dy;
  if (equipmentIndex < 0) {
    equipmentIndex = 0;
  }
  if (equipmentIndex >= equipmentSlots.length) {
    equipmentIndex = equipmentSlots.length - 1;
  }
  renderDungeon();
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", (key) => {
  if (key === "\u0003") {
    process.exit();
  } // Ctrl+C

  if (key === "i" || key === "I" || key === "\u001b") {
    inventoryIndex = 0;
    inventoryMode = !inventoryMode;
    equipmentMode = false;
    renderDungeon();
    return;
  }

  if (key === "e" || key === "E" || key === "\u001b") {
    equipmentMode = !equipmentMode;
    inventoryMode = false;
    equipmentIndex = 0;
    renderDungeon();
    return;
  }

  if (key === "Backspace" || key === "\u007F" || key === "\u0008") {
    if (!inventoryMode) {
      return;
    }

    const item = inventory[inventoryIndex];
    if (!item) {
      return;
    }

    inventory[inventoryIndex] = null;
    renderDungeon();

    return;
  }

  if (key === "Enter" || key === "\r") {
    if (!inventoryMode) {
      return;
    }

    const item = inventory[inventoryIndex];
    if (!item) {
      return;
    }

    if (item instanceof Equipable) {
      const slot = item.equipSlot;
      const currentlyEquipped = equipment[slot];

      equipment[slot] = item;
      inventory[inventoryIndex] = currentlyEquipped || null;

      renderDungeon();
    }

    return;
  }

  const dir = {
    "\u001b[A": [0, -1],
    "\u001b[B": [0, 1],
    "\u001b[C": [1, 0],
    "\u001b[D": [-1, 0],
  }[key];

  if (dir) {
    if (inventoryMode) {
      moveInventory(...dir);
    }
    else if (equipmentMode) {
      moveEquipment(dir[1]);
    }// only up/down needed
    else {
      movePlayer(...dir);
    }
  }
});

renderDungeon();
