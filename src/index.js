import { Ship, Gameboard, Player } from "./factories.js";

const GameController = (() => {
  const restartBtn = document.querySelector(".restartBtn");

  const instructions = document.querySelector(".instructions");

  const player1 = Player("Player 1");
  const player2 = Player();

  let currentPlayer = player1;
  let running = false;

  const startGame = () => {
    restartBtn.addEventListener("click", restartGame);
    instructions.textContent = `${currentPlayer.name}'s turn`;
    running = true;
  };

  const changePlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    instructions.textContent = `${currentPlayer.name}'s turn`;
  };

  const restartGame = () => {
    Gameboard.reset();
    currentPlayer = player1;
    instructions.textContent = `${currentPlayer.name}'s turn`;
    running = true;
  };
})();
