// create GameBoard object
let GameBoard = {
    gameboard: [],
  
    // initialise game board
    initBoard: function() {
      this.gameboard = [
        '', '', '',  // 0, 1, 2 - row 1
        '', '', '',  // 3, 4, 5 - row 2
        '', '', ''   // 6, 7, 8 - row 3
      ];
    },
  
    playerMove: function(cell, playerSymbol) {
      // check if cell is already filled
      if (this.gameboard[cell] === '') {
        // update the gameboard with player symbol
        this.gameboard[cell] = playerSymbol;
        return true; // Return true if the move is valid and successfully made
      }
      return false; // Return false if the move is invalid
    },
  
    updateBoard: function() {
        let board = document.getElementById("gameboard");
      
        // clear existing board contents
        board.innerHTML = '';
      
        // loop through the gameboard array and update the display
        for (let i = 0; i < this.gameboard.length; i++) {
          let cell = document.createElement("div");
          cell.classList.add("cell");
          cell.textContent = this.gameboard[i];
          board.appendChild(cell);
      
          // Add event listener to the new cell
          cell.addEventListener("click", () => {
            cell.dataset.cellIndex = i;
            GameController.makeMove(i);
          });
        }
      },
  
    checkWin: function() {
      // check if a player has won the game
      const winConditions = [
        //rows
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        //columns
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        //diagonals
        [0, 4, 8], [2, 4, 6]
      ];
  
      for (const combination of winConditions) {
        const [a, b, c] = combination;
        const symbolA = this.gameboard[a];
        const symbolB = this.gameboard[b];
        const symbolC = this.gameboard[c];
  
        if (symbolA !== '' && symbolA === symbolB && symbolB === symbolC) {
          // add class to winning cells
          const cells = document.getElementsByClassName("cell");
          cells[a].classList.add("winning-cell");
          cells[b].classList.add("winning-cell");
          cells[c].classList.add("winning-cell");

          return symbolA; // returns the winning symbol X or O
        }
      }
  
      return null; // else return null, no win condition has been met yet.
    },
  
    checkDraw: function() {
      // check if the game has resulted in a draw
      // check if board is full
      const isBoardFilled = this.gameboard.every(cell => cell !== '');
  
      //check if nobody has won
      const noWin = !this.checkWin();
  
      //return true if board is full and nobody has won
      return isBoardFilled && noWin;
    },
  };
  
  // create an object to control the flow of the game
  const GameController = {
    currentPlayer: null,
    players: [],
  
    logToConsole: function(string) {
      const console = document.getElementById("console");
      console.textContent = string;
    },
    
    startGame: function(playerOne, playerTwo) {
      // initialise the game, set up players.
      GameBoard.initBoard();
  
      // create players
      const player1 = createPlayerFactory(playerOne, "X");
      const player2 = createPlayerFactory(playerTwo, "O");
  
      // initalise players in GameController
      this.players = [player1, player2];
  
      // Determine the starting player
      const randomIndex = Math.floor(Math.random() * this.players.length);
      this.currentPlayer = this.players[randomIndex];
  
      // Log Game Started & Current player
      GameController.logToConsole("Game started!");  
      GameController.logToConsole(`${this.currentPlayer.name}! It's your turn!`);

    // Add event listeners to cells for player moves
    const cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        cell.dataset.cellIndex = index;
        this.makeMove(index);
      });
    });
  },
  
  makeMove: function(cellIndex) {
    const playerSymbol = this.currentPlayer.symbol;
    const isValidMove = GameBoard.playerMove(cellIndex, playerSymbol);
  
    if (isValidMove) {
      // update the game board with the player's move
      GameBoard.updateBoard();
  
      // check if the game is won or drawn
      const winningSymbol = GameBoard.checkWin();
      const isDraw = GameBoard.checkDraw();
  
      // handle end of the game
      if (winningSymbol) {
        this.endGame(winningSymbol);
      } else if (isDraw) {
        GameController.logToConsole("Game Over! It's a draw!");
      } else {
        // switch to the next player's turn
        this.switchTurn();
      }
    }
  },
  
    switchTurn: function() {
      // switch which player's turn it is
      // find index of current player
      const currentIndex = this.players.indexOf(this.currentPlayer);
  
      // determine index of next player
      const nextIndex = (currentIndex + 1) % this.players.length;
  
      // set the next player as current player
      this.currentPlayer = this.players[nextIndex];
  
      // log switching of players
      GameController.logToConsole(`${this.currentPlayer.name}! It's your turn!`);
    },
  
    endGame: function(winningSymbol) {
      // Handle end of the game, display the winner.
      if (winningSymbol) {
        const winner = this.players.find(player => player.symbol === winningSymbol);
        GameController.logToConsole(`Game Over! ${winner.name} wins!`);
      }
    }
  };
  
  // player factory function for creating a new player
  function createPlayerFactory(name, symbol) {
    return {
      name,
      symbol,
    };
  }

  // add event listener for button to start a newGame
  const newGame = document.getElementById("dub-arrow");
  newGame.addEventListener("click", () => {
    GameBoard.initBoard();
    GameBoard.updateBoard();

    playerOneInput = document.getElementById("player1input");
    playerTwoInput = document.getElementById("player2input");
    gameboard = document.getElementById("gameboard");
    loader = document.getElementById("loader");

    gameboard.classList.replace("hidden", "visible");
    loader.classList.add("hidden");
    
    playerOne = playerOneInput.value;
    playerTwo = playerTwoInput.value;
    return GameController.startGame(playerOne, playerTwo)

  });