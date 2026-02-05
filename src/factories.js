function Ship(length, row = null, col = null, orient = "H") {
  let hits = 0;

  if (length < 1 || length > 5) {
    throw new Error("Enter a length between 0 and 6");
  }

  const hit = () => hits++;
  const isSunk = () => hits >= length;

  return { shipRow: row, shipCol: col, shipOrient: orient, hit, isSunk };
}

function Gameboard() {
  const board = {
    A: ["", "", "", "", "", "", "", "", "", ""],
    B: ["", "", "", "", "", "", "", "", "", ""],
    C: ["", "", "", "", "", "", "", "", "", ""],
    D: ["", "", "", "", "", "", "", "", "", ""],
    E: ["", "", "", "", "", "", "", "", "", ""],
    F: ["", "", "", "", "", "", "", "", "", ""],
    G: ["", "", "", "", "", "", "", "", "", ""],
    H: ["", "", "", "", "", "", "", "", "", ""],
    I: ["", "", "", "", "", "", "", "", "", ""],
    J: ["", "", "", "", "", "", "", "", "", ""],
  };
  const rows = Object.keys(board);

  let ships = [];
  let misses = [];

  const getBoard = () => board;
  const resetBoard = () => {
    ships = [];
    misses = [];

    for (const row in board) board[row] = board[row].map(() => "");
  };

  const placeShip = (length, row, col, orient = "H") => {
    if (row == null || col == null) {
      throw new Error("Ships needs coordinates");
    }

    const startRowIndex = rows.indexOf(row);
    if (startRowIndex === -1) throw new Error("Invalid row");

    if (
      (orient === "H" && col + length > 10) ||
      (orient === "V" && startRowIndex + length > 10)
    ) {
      throw new Error("Ship does not fit on board");
    }

    for (let i = 0; i < length; i++) {
      const r = orient === "V" ? rows[startRowIndex + i] : row;
      const c = orient === "H" ? col + i : col;

      if (board[r][c]) {
        throw new Error("Space already occupied");
      }
    }

    const ship = Ship(length, row, col, orient);
    ships.push(ship);

    for (let i = 0; i < length; i++) {
      const r = orient === "V" ? rows[startRowIndex + i] : row;
      const c = orient === "H" ? col + i : col;

      board[r][c] = { type: "ship", ship };
    }

    return ship;
  };

  const attackMiss = (row, col) => {
    const alreadyMissed = misses.some(
      (miss) => miss.row === row && miss.col === col,
    );

    if (!alreadyMissed) {
      misses.push({ row, col });
    }
  };

  const receiveAttack = (row, col) => {
    if (ships.length === 0) return "No Ship";

    const cell = board[row][col];

    if (cell === "miss") return "Already attacked";

    if (!cell) {
      board[row][col] = "miss";
      attackMiss(row, col);
      return "Miss";
    }

    if (cell.type === "ship") {
      const targetShip = cell.ship;

      if (targetShip.isSunk()) return "Already Sunk";

      if (cell.hit) return "Already attacked";

      cell.hit = true;
      targetShip.hit();

      if (targetShip.isSunk()) {
        const allShipsSunk = ships.every((ship) => ship.isSunk());
        return allShipsSunk ? "Game Over" : "Sunk";
      }

      return "Hit";
    }
  };

  const getShipsLeft = () =>
    ships.filter((ship) => !ship.isSunk()).length;

  return {
    misses,
    getBoard,
    resetBoard,
    placeShip,
    receiveAttack,
    getShipsLeft,
  };
}

function Player(name) {
  let score = 0;
  const type = name ? "Real" : "Computer";
  if (type === "Computer") name = "Computer";

  const getScore = () => score;
  const addScore = () => score++;

  const gameboard = Gameboard();

  return { name, type, getScore, addScore, gameboard };
}

export { Ship, Gameboard, Player };
