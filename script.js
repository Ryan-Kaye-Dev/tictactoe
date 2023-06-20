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
        // player move function, write playerSymbol into gameboard cell
        this.gameboard[cell] = playerSymbol;
    },

    updateBoard: function() {
        let board = document.getElementById("gameboard");

        // clear existing board contents
        board.innerHTML = '';

        // loop through the gameboard array and update the display
        for (let i = 0; i < GameBoard.gameboard.length; i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = GameBoard.gameboard[i];
            board.appendChild(cell);
        }

    },

    checkWin: function() {
        // check if a player has won the game
        const winConditions = [
            //rows
            [0,1,2], [3,4,5], [6,7,8],
            //columns
            [0,3,6], [1,4,7], [2,5,8],
            //diagonals
            [0,4,8], [2,4,6]
        ];

        for (const combination of winConditions) {
            const [a, b, c] = combination;
            const symbolA = this.gameboard[a];
            const symbolB = this.gameboard[b];
            const symbolC = this.gameboard[c];

            if (symbolA !== '' && symbolA === symbolB && symbolB === symbolC) {
                return symbolA // returns the winning symbol X or O
            }
        }

        return null // else return null, no win condition has been met yet.
    },

    checkDraw: function() {
        // check if the game has resulted in a draw
        // check if board is full
        const isBoardFilled = GameBoard.gameboard.every(cell => cell !== '');

        //check if nobody has won
        const noWin = !this.checkWin();

        //return true if board is full and nobody has won
        return isBoardFilled && noWin
    },
};

// create an object to control the flow of the game
const GameController = {
    currentPlayer: null,
    players: [],

    startGame: function() {
        // initialise the game, set up players.
        GameBoard.initBoard();

        // create players
        const player1 = createPlayer("ryan", "X");
        const player2 = createPlayer("taylor", "O");

        // initalise players in GameController
        this.players = [player1, player2];

        // Determine the starting player

        const randomIndex = Math.floor(Math.random() * this.players.length);
        this.currentPlayer = this.players[randomIndex];

        // Log Game Started & Current player
        console.log("Game started!");
        console.log(`${this.currentPlayer.name}! It's your turn!`)
    },

    switchTurn: function() {
        // switch which player's turn it is
        // find index of current player
        const currentIndex = this.players.indexOf(this.currentPlayer);

        // determine index of next player
        const nextIndex = (currentIndex + 1) % this.players.length;

        // set the next player as current player
        this.currentPlayer = this.players[nextIndex];

        //log switching of players
        console.log(`Switched turn to ${this.currentPlayer.name}.`)
    },

    endGame: function(winningSymbol) {
        // Handle end of the game, display the winner.
        if (winningSymbol) {
            const winner = this.players.find(player => player.symbol === winningSymbol);
                console.log(`Game Over! ${winner.name} wins!`)
        }
    }
}

// player factory function for creating a new player
function createPlayer(name, symbol){
    return {
        name,
        symbol,
        makeMove: function(cell) {
            GameBoard.playerMove(cell, symbol);
        }
    }
};