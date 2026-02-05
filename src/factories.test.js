const { Ship, Gameboard, Player } = require("./factories");

// Testing Ship Factory Function
test("Ship length test", () => {
  expect(() => (ship = Ship(0))).toThrow("Enter a length between 0 and 6");
  expect(() => (ship = Ship(7))).toThrow("Enter a length between 0 and 6");
});

test("Ship is not sunk when created", () => {
  const ship = Ship(2);

  expect(ship.isSunk()).toBe(false);
});

test("Ship is not sunk after 1 hit", () => {
  const ship = Ship(2);

  ship.hit();

  expect(ship.isSunk()).toBe(false);
});

test("Ship is sunk after being hit twice", () => {
  const ship = Ship(2);

  ship.hit();
  ship.hit();

  expect(ship.isSunk()).toBe(true);
});

test("Ship is still sunk after being sunk", () => {
  const ship = Ship(2);

  ship.hit();
  ship.hit();
  ship.hit();

  expect(ship.isSunk()).toBe(true);
});

// Testing Gameboard Factory Function
test("Ship needs coordinates", () => {
  const board = Gameboard();

  expect(() => board.placeShip(2)).toThrow("Ships needs coordinates");
});

test("Cannot place ship on occupied space", () => {
  const board = Gameboard();
  board.placeShip(2, "A", 1);

  expect(() => board.placeShip(3, "A", 1)).toThrow("Space already occupied");
});

test("Ship attack missed", () => {
  const board = Gameboard();
  board.placeShip(2, "A", 1, "H");

  expect(board.receiveAttack("G", 5)).toBe("Miss");
  expect(board.getBoard()["G"][5]).toBe("miss");
  expect(board.misses.length).toBe(1);
});

test("Ship attack hit", () => {
  const board = Gameboard();
  board.placeShip(2, "A", 2);

  expect(board.receiveAttack("A", 2)).toBe("Hit");
});

test("Attacks register already sunk ships", () => {
  const board = Gameboard();
  board.placeShip(2, "A", 2);
  board.placeShip(3, "B", 3);

  expect(board.receiveAttack("A", 2)).toBe("Hit");
  expect(board.receiveAttack("A", 3)).toBe("Sunk");
  expect(board.receiveAttack("A", 3)).toBe("Already Sunk");
});

test("Game ends when last ship is sunk", () => {
  const board = Gameboard();
  board.placeShip(1, "A", 2);
  board.placeShip(2, "C", 1);

  expect(board.receiveAttack("A", 2)).toBe("Sunk");
  expect(board.receiveAttack("C", 1)).toBe("Hit");
  expect(board.receiveAttack("C", 2)).toBe("Game Over");
});

test("Reset game works and allows changing positions", () => {
  const board = Gameboard();
  board.placeShip(3, "A", 1);
  expect(board.receiveAttack("A", 1)).toBe("Hit");

  board.resetBoard();
  board.placeShip(3, "A", 3);
  expect(board.receiveAttack("A", 1)).toBe("Miss");
});

// Testing Player Factory Function
test("Player is created", () => {
  const player1 = Player("Player");

  expect(player1.type).toBe("Real");
});

test("Player and computer are created", () => {
  const player1 = Player("Player");
  const player2 = Player();

  expect(player1.type).toBe("Real");
  expect(player2.type).toBe("Computer");
});

test("Players are named correctly", () => {
  const player1 = Player("Todd");
  const player2 = Player();

  expect(player1.name).toBe("Todd");
  expect(player2.name).toBe("Computer");
});
