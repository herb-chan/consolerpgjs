import chalk from "chalk";

const WIDTH = 60;
const HEIGHT = 30;
const NUM_ROOMS = 100;
const MIN_ROOM_SIZE = 4;
const MAX_ROOM_SIZE = 12;

const DISTANCE_FROM_OTHER_ROOM = 6;

// Tile definitions
const WALL = {
  char: "█",
  color: chalk.black,
};

const FLOOR = {
  char: "█",
  color: chalk.bgGrey,
};

const TUNNEL = {
  char: "█",
  color: chalk.yellowBright,
};

const PLAYER = {
  char: "@",
  color: chalk.greenBright.bold,
};

// Create dungeon filled with walls
const dungeon = Array.from({ length: HEIGHT }, () =>
  Array.from({ length: WIDTH }, () => ({ ...WALL }))
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
        dungeon[i][j] = { ...FLOOR };
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
      // Right side
      entry = { x: room.x + room.w, y: cy };
      start = { x: entry.x + 2, y: entry.y };
      direction = "right";
    } else {
      // Left side
      entry = { x: room.x - 1, y: cy };
      start = { x: entry.x - 2, y: entry.y };
      direction = "left";
    }
  } else {
    if (dy > 0) {
      // Bottom
      entry = { x: cx, y: room.y + room.h };
      start = { x: entry.x, y: entry.y + 2 };
      direction = "down";
    } else {
      // Top
      entry = { x: cx, y: room.y - 1 };
      start = { x: entry.x, y: entry.y - 2 };
      direction = "up";
    }
  }

  // Clamp to bounds
  entry.x = Math.max(1, Math.min(WIDTH - 2, entry.x));
  entry.y = Math.max(1, Math.min(HEIGHT - 2, entry.y));
  start.x = Math.max(1, Math.min(WIDTH - 2, start.x));
  start.y = Math.max(1, Math.min(HEIGHT - 2, start.y));

  // Carve tunnel and poke into room
  carveLine(start, entry);
  pokeIntoRoom(entry, direction);

  return start;
}

function pokeIntoRoom(entry, direction) {
  let poke;
  switch (direction) {
    case "right":
      poke = { x: entry.x - 1, y: entry.y };
      break;
    case "left":
      poke = { x: entry.x + 1, y: entry.y };
      break;
    case "down":
      poke = { x: entry.x, y: entry.y - 1 };
      break;
    case "up":
      poke = { x: entry.x, y: entry.y + 1 };
      break;
  }
  if (poke && poke.x > 0 && poke.x < WIDTH && poke.y > 0 && poke.y < HEIGHT) {
    dungeon[poke.y][poke.x] = { ...TUNNEL };
  }
}

function carveLine(p1, p2) {
  if (p1.x === p2.x) {
    createVTunnel(p1.y, p2.y, p1.x);
  } else if (p1.y === p2.y) {
    createHTunnel(p1.x, p2.x, p1.y);
  }
}

function createHTunnel(x1, x2, y) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    if (
      y > 0 &&
      y < HEIGHT &&
      x > 0 &&
      x < WIDTH &&
      dungeon[y][x].char === WALL.char
    ) {
      dungeon[y][x] = { ...TUNNEL };
    }
  }
}

function createVTunnel(y1, y2, x) {
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    if (
      y > 0 &&
      y < HEIGHT &&
      x > 0 &&
      x < WIDTH &&
      dungeon[y][x].char === WALL.char
    ) {
      dungeon[y][x] = { ...TUNNEL };
    }
  }
}

function createPath(from, to) {
  if (Math.random() < 0.5) {
    createHTunnel(from.x, to.x, from.y);
    createVTunnel(from.y, to.y, to.x);
  } else {
    createVTunnel(from.y, to.y, from.x);
    createHTunnel(from.x, to.x, to.y);
  }
}

// Generate non-overlapping rooms
for (let i = 0; i < NUM_ROOMS; i++) {
  let w, h;
  if (Math.random() < 0.5) {
    // Wide room
    w = random(MIN_ROOM_SIZE + 2, MAX_ROOM_SIZE);
    h = random(MIN_ROOM_SIZE, MAX_ROOM_SIZE - 2);
  } else {
    // Tall room
    w = random(MIN_ROOM_SIZE, MAX_ROOM_SIZE - 2);
    h = random(MIN_ROOM_SIZE + 2, MAX_ROOM_SIZE);
  }

  // Small chance for perfect square
  if (Math.random() < 0.1) {
    const size = random(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    w = h = size;
  }

  const x = random(1, WIDTH - w - 2);
  const y = random(1, HEIGHT - h - 2);

  const newRoom = { x, y, w, h };

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

// Connect rooms
const connected = [validRooms[0]];
const unconnected = validRooms.slice(1);

while (unconnected.length > 0) {
  let bestDist = Infinity;
  let fromRoom = null;
  let toRoom = null;

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
// const playerStart = center(rooms[0]);
// dungeon[playerStart.y][playerStart.x] = { ...PLAYER };

// Render dungeon
for (const row of dungeon) {
  let line = "";
  for (const tile of row) {
    if (tile.char && tile.color) {
      line += tile.color(tile.char);
    } else {
      line += tile;
    }
  }
  console.log(line);
}
