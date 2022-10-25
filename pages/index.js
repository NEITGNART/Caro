import {useEffect, useState} from "react";
import {structuredClone} from "next/dist/compiled/@edge-runtime/primitives/structured-clone";

// create multi dimensions array
const createArray = function (length) {
    let arr = new Array(length || 0), i = length;
    if (arguments.length > 1) {
        const args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
};

const Square = ({value, handleClick, color}) => {
    if (color) {
        return (<button style={{color: color}} className="square" onClick={handleClick}>
            {value}
        </button>);
    }
    return (<button className="square" onClick={handleClick}>
        {value}
    </button>);
};

const renderSquare = (key, value, onClick, color) => {
    return <Square color={color} key={key} value={value} handleClick={onClick}/>;
};

const getBoardGame = (board, onClick, moveWining, isWining) => {
    const boardGame = [];

    for (let i = 0; i < board.length; ++i) {
        const rows = [];
        for (let j = 0; j < board[0].length; ++j) {
            rows.push(renderSquare(i * board.length + j, board[i][j], () => {
                onClick(i, j);
            }, isWining && moveWining?.includes(i * board.length + j) ? "red" : null));
        }
        boardGame.push(<div key={`board${i}`} className="board-row">
            {rows}
        </div>);
    }
    return boardGame;
};

const Board = ({board, onClick, moveWining, isWining}) => {
    const squares = getBoardGame(board, onClick, moveWining, isWining);
    return <div>{squares}</div>;
};

const calculateWinner = (board) => {
    const n = board.length;
    const m = board[0].length;
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < m; ++j) {
            if (!board[i][j]) {
                continue;
            }
            if (i + 4 < n && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j] && board[i][j] === board[i + 3][j] && board[i][j] === board[i + 4][j]) {
                return [i * n + j, (i + 1) * n + j, (i + 2) * n + j, (i + 3) * n + j, (i + 4) * n + j,];
            }
            if (j + 4 < m && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2] && board[i][j] === board[i][j + 3] && board[i][j] === board[i][j + 4]) {
                return [i * n + j, i * n + j + 1, i * n + j + 2, i * n + j + 3, i * n + j + 4,];
            }
            if (i + 4 < n && j + 4 < m && board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2] && board[i][j] === board[i + 3][j + 3] && board[i][j] === board[i + 4][j + 4]) {
                return [i * n + j, (i + 1) * n + j + 1, (i + 2) * n + j + 2, (i + 3) * n + j + 3, (i + 4) * n + j + 4,];
            }
            if (i - 4 >= 0 && j + 4 < m && board[i][j] === board[i - 1][j + 1] && board[i][j] === board[i - 2][j + 2] && board[i][j] === board[i - 3][j + 3] && board[i][j] === board[i - 4][j + 4]) {
                return [i * n + j, (i - 1) * n + j + 1, (i - 2) * n + j + 2, (i - 3) * n + j + 3, (i - 4) * n + j + 4,];
            }
        }
    }
    return null;
};


const Game = () => {
    const [history, setHistory] = useState(createArray(1, 10, 10));
    const [moveHistory, setMoveHistory] = useState([{row: null, col: null}]);
    const [xIsNext, setXIsNext] = useState(true);
    const [isWinner, setIsWinner] = useState(false);
    const [isDraw, setIsDraw] = useState(false);
    const [stepNum, setStepNum] = useState(0);
    const [moveWining, setMoveWining] = useState(null);
    const [isAsc, setIsAsc] = useState(false);

    useEffect(() => {
        const winner = calculateWinner(history[stepNum]);
        if (winner) {
            setIsWinner(() => true);
            setMoveWining(() => winner);
        } else if (stepNum === history[0].length * history[0][0].length) {
            setIsDraw(() => true);
        } else {
            setIsWinner(() => false);
            setIsDraw(() => false);
        }
    }, [isWinner, isDraw, stepNum, history, moveWining]);

    const handleClick = (i, j) => {
        const currentHistory = history.slice(0, stepNum + 1);
        const board = structuredClone(currentHistory[currentHistory.length - 1]);
        const move = moveHistory.slice(0, stepNum + 1);
        if (board[i][j] || isWinner || isDraw) return;

        board[i][j] = xIsNext ? "X" : "O";

        setHistory(() => {
            return [...currentHistory, structuredClone(board)];
        });
        setStepNum(() => currentHistory.length);
        setXIsNext((prevState) => !prevState);
        setMoveHistory(() => {
            return [...move, {row: i + 1, col: j + 1}];
        });
    };

    const status = isWinner ? `Winner: ${xIsNext ? "O" : "X"}` : isDraw ? "Draw" : `Next player: ${xIsNext ? "X" : "O"}`;

    const jumpTo = (move) => {
        setStepNum(move);
        setXIsNext(move % 2 === 0);
    };

    const moves = history.map((step, move) => {
        const desc = move ? `Go to move #${move} at (${moveHistory[move]?.row}, ${moveHistory[move]?.col})` : "Go to game start";
        return (<li key={`move${move}`}>
            {move === stepNum ? (<button style={{background: "red"}} onClick={() => jumpTo(move)}>
                {desc}
            </button>) : (<button onClick={() => jumpTo(move)}>{desc}</button>)}
        </li>);
    });

    return (<div className="game">
        <div className="game-board">
            <Board
                isWining={isWinner}
                moveWining={moveWining}
                board={history[stepNum]}
                onClick={handleClick}
            />
        </div>
        <div className="game-info">
            <div>{status}</div>
            <button onClick={() => setIsAsc((prev) => !prev)}>Reverse the order</button>
            <ol>{isAsc ? moves : moves.slice().reverse()}</ol>
        </div>
    </div>);
};

export default function Home() {
    return (<>
        <title>Caro nhẹ nhàng</title>
        <Game/>
    </>);
}
