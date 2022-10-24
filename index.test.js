const calculateWinner = (board) => {
    const n = board.length;
    const m = board[0].length;
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < m; ++j) {
            if (!board[i][j]) {
                continue;
            }
            if (i + 4 < n && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j] && board[i][j] === board[i + 3][j] && board[i][j] === board[i + 4][j]) {
                return board[i][j];
            }
            if (j + 4 < m && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2] && board[i][j] === board[i][j + 3] && board[i][j] === board[i][j + 4]) {
                return board[i][j];
            }
            if (i + 4 < n && j + 4 < m && board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2] && board[i][j] === board[i + 3][j + 3] && board[i][j] === board[i + 4][j + 4]) {
                return board[i][j];
            }
            if (i - 4 >= 0 && j + 4 < m && board[i][j] === board[i - 1][j + 1] && board[i][j] === board[i - 2][j + 2] && board[i][j] === board[i - 3][j + 3] && board[i][j] === board[i - 4][j + 4]) {
                return board[i][j];
            }
        }
    }
    return null;
}

// create 10x10 2d array

// const createArray = (n, m) => {
//     return Array.from({length: n}, () => Array.from({length: m}, () => null));
// }

// create multi dimensions array
function createArray(length) {
    let arr = new Array(length || 0), i = length;
    if (arguments.length > 1) {
        const args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}


const Game = () => {
    const board = createArray(10, 10);
    board[0][0] = 'X';
    board[1][1] = 'X';
    board[2][2] = 'X';
    board[3][3] = 'X';
    board[4][4] = 'X';
    const winner = calculateWinner(board);
    console.log(winner);
}

Game();