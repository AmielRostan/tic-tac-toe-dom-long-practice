// Your code here
document.addEventListener('DOMContentLoaded', () => {
    let turn = 0;
    const grid = document.body.querySelector('.grid');
    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    const newGameButton = document.body.querySelector('#newGame');
    const giveUpButton = document.body.querySelector('#giveUp');

    giveUpButton.addEventListener('click', giveUp);
    function giveUp() {
        newGameButton.disabled = false;
        giveUpButton.disabled = true;
        gameOver();
        if(turn % 2 === 0) {
            document.body.querySelector('h1').innerText = 'Winner: ' + "O";
        } else {
            document.body.querySelector('h1').innerText = 'Winner: ' + "X";
        }
    }

    function startGame() {
        grid.querySelectorAll('.cell').forEach((cell, index) => {
            cell.addEventListener('click', handleClick);
            if(cell.firstChild) {
                cell.removeChild(cell.firstChild);
            }
        });
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[0].length; j++) {
                board[i][j] = null;
            }
        }
        turn = 0;
        document.body.querySelector('h1').innerText = '';
        newGameButton.disabled = true;
        giveUpButton.disabled = false;
        // saveGameState();
    }

    newGameButton.addEventListener('click', newGame);
    function newGame() {
        grid.querySelectorAll('.cell').forEach((cell, index) => {
            cell.addEventListener('click', handleClick);
            if(cell.firstChild) {
                cell.removeChild(cell.firstChild);
            }
        });
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[0].length; j++) {
                board[i][j] = null;
            }
        }
        turn = 0;
        document.body.querySelector('h1').innerText = '';
        newGameButton.disabled = true;
        giveUpButton.disabled = false;
        saveGameState();
    }
    startGame();

    function saveGameState() {
        localStorage.setItem('ticTacToeState', JSON.stringify({ turn, board }));
    }

    function loadGameState() {
        const gameState = localStorage.getItem('ticTacToeState');
        if (gameState) {
            const { turn: savedTurn, board: savedBoard } = JSON.parse(gameState);
            turn = savedTurn;
            for (let i = 0; i < savedBoard.length; i++) {
                for (let j = 0; j < savedBoard[0].length; j++) {
                    board[i][j] = savedBoard[i][j];
                }
            }
            // renderBoard();
        }
    }

    loadGameState();
    renderBoard();

    function renderBoard() {
        // Renderizar el tablero con el estado actual guardado en 'board'
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const cell = grid.querySelector(`[data-row-index="${i}"][data-col-index="${j}"]`);
                if (board[i][j] === 'X') {
                    renderSymbol(cell, 'player-x.svg');
                } else if (board[i][j] === 'O') {
                    renderSymbol(cell, 'player-o.svg');
                }
            }
        }
        const winner = checkWinner(board);
        if(winner) {
            newGameButton.disabled = false;
            document.body.querySelector('h1').innerText = 'Winner: ' + winner;
            gameOver();
        }
    }

    function handleCellClick(cell, handleClick) {
        const currentPlayer = turn % 2;
        const rowIndex = parseInt(cell.dataset.rowIndex);
        const colIndex = parseInt(cell.dataset.colIndex);

        if(currentPlayer === 0) {
            renderSymbol(cell, 'player-x.svg');
            board[rowIndex][colIndex] = 'X';
        } else {
            renderSymbol(cell, 'player-o.svg');
            board[rowIndex][colIndex] = 'O';
        }

        turn++;
        saveGameState();
        cell.removeEventListener('click', handleClick);
        const winner = checkWinner(board);
        if(winner) {
            newGameButton.disabled = false;
            document.body.querySelector('h1').innerText = 'Winner: ' + winner;
            gameOver();
        }

    }

    function handleClick(event) {
        const cell = event.target;
        handleCellClick(cell, handleClick);
    };

    function gameOver() {
        grid.querySelectorAll('.cell').forEach((cell, index) => {
            cell.removeEventListener('click', handleClick);
        });
        giveUpButton.disabled = true;
    }

    function renderSymbol(cell, svgFile) {
        const objectElement = document.createElement('object');
        objectElement.setAttribute('type', 'image/svg+xml');
        objectElement.setAttribute('data', svgFile);
        objectElement.width = 150;
        objectElement.height = 150;

        cell.appendChild(objectElement);
    }

    function checkWinner(board) {
        const lines = [
            // Horizontal combinations
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // Vertical combinations
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // Diagonal combinations
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            const [rowA, colA] = a;
            const [rowB, colB] = b;
            const [rowC, colC] = c;

            const valueA = board[rowA][colA];
            const valueB = board[rowB][colB];
            const valueC = board[rowC][colC];

            if (valueA && valueA === valueB && valueA === valueC) {
                return valueA;
            }
        }

        if(turn === 9) {
            return 'T'
        } else {
            return false;
        }
    }
});
