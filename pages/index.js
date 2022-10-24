import { useEffect, useState } from "react";
import { structuredClone } from "next/dist/compiled/@edge-runtime/primitives/structured-clone";

// create multi dimensions array
const createArray = function (length) {
  let arr = new Array(length || 0),
    i = length;
  if (arguments.length > 1) {
    const args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }
  return arr;
};

const Square = ({ value, handleClick }) => (
  <button className="square" onClick={handleClick}>
    {value}
  </button>
);

const renderSquare = (key, value, onClick) => {
  return <Square key={`cell${key}`} handleClick={onClick} value={value} />;
};

const getBoardGame = (board, onClick) => {
  const boardGame = [];

  for (let i = 0; i < board.length; ++i) {
    const rows = [];
    for (let j = 0; j < board[0].length; ++j) {
      rows.push(
        renderSquare(i * board.length + j, board[i][j], () => {
          onClick(i, j);
        })
      );
    }
    boardGame.push(
      <div key={`board${i}`} className="board-row">
        {rows}
      </div>
    );
  }
  return boardGame;
};

const Board = ({ board, onClick }) => {
  const squares = getBoardGame(board, onClick);

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
      if (
        i + 4 < n &&
        board[i][j] === board[i + 1][j] &&
        board[i][j] === board[i + 2][j] &&
        board[i][j] === board[i + 3][j] &&
        board[i][j] === board[i + 4][j]
      ) {
        return board[i][j];
      }
      if (
        j + 4 < m &&
        board[i][j] === board[i][j + 1] &&
        board[i][j] === board[i][j + 2] &&
        board[i][j] === board[i][j + 3] &&
        board[i][j] === board[i][j + 4]
      ) {
        return board[i][j];
      }
      if (
        i + 4 < n &&
        j + 4 < m &&
        board[i][j] === board[i + 1][j + 1] &&
        board[i][j] === board[i + 2][j + 2] &&
        board[i][j] === board[i + 3][j + 3] &&
        board[i][j] === board[i + 4][j + 4]
      ) {
        return board[i][j];
      }
      if (
        i - 4 >= 0 &&
        j + 4 < m &&
        board[i][j] === board[i - 1][j + 1] &&
        board[i][j] === board[i - 2][j + 2] &&
        board[i][j] === board[i - 3][j + 3] &&
        board[i][j] === board[i - 4][j + 4]
      ) {
        return board[i][j];
      }
    }
  }
  return null;
};

const Game = () => {
  const [history, setHistory] = useState(createArray(1, 10, 10));
  const [xIsNext, setXIsNext] = useState(true);
  const [isWinner, setIsWinner] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [stepNum, setStepNum] = useState(0);

  useEffect(() => {
    const winner = calculateWinner(history[stepNum]);
    if (winner) {
      setIsWinner(() => true);
    } else if (stepNum === history[0].length * history[0][0].length) {
      setIsDraw(() => true);
    } else {
      setIsWinner(() => false);
      setIsDraw(() => false);
    }
  }, [isWinner, isDraw, stepNum, history]);

  const handleClick = (i, j) => {
    const currentHistory = history.slice(0, stepNum + 1);
    const board = structuredClone(currentHistory[currentHistory.length - 1]);

    if (board[i][j] || isWinner || isDraw) return;

    board[i][j] = xIsNext ? "X" : "O";

    setHistory(() => {
      return [...currentHistory, structuredClone(board)];
    });
    setStepNum(() => currentHistory.length);
    setXIsNext((prevState) => !prevState);
  };

  const status = isWinner
    ? `Winner: ${xIsNext ? "O" : "X"}`
    : isDraw
    ? "Draw"
    : `Next player: ${xIsNext ? "X" : "O"}`;

  const jumpTo = (move) => {
    setStepNum(move);
    setXIsNext(move % 2 === 0);
  };

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={`move${move}`}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board board={history[stepNum]} onClick={handleClick} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <>
      <title>Caro nhẹ nhàng</title>
      <link
        rel="icon"
        href="https://avatars.githubusercontent.com/u/63442323?s=400&u=6c7e39388a72491c2099a069ec7a5cb4698ab73e&v=4"
        type="image/x-icon"
      />
      <Game />
    </>
  );
}
