import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width': '60px',
  'height': '60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'white'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
}

// For checking winners.
const INDICES_TO_CHECK = [
  [0, 1, 2], // Horizontal.
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Vertical.
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonal. 
  [2, 4, 6],
];
function determineWinner(elements) {
  for (let i = 0; i < INDICES_TO_CHECK.length; i++) {
    const line = INDICES_TO_CHECK[i];
    const [x, y, z] = line;

    if (
      elements[x] != null &&
      elements[x] === elements[y] &&
      elements[x] === elements[z]
    ) {
      return elements[x];
    }
  }

  return null;
}

function Square(props) {
  const { content, onClick } = props;

  return (
    <div
      className="square"
      style={squareStyle}
      onClick={onClick}>
      {content}
    </div>
  );
}

function Board() {
  const [elements, setElements] = useState([]);
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleReset = useCallback(() => {
    setElements(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
  }, [setElements, setIsXTurn, setWinner]);

  // Init. 
  useEffect(() => {
    handleReset();
  }, [])

  // Checking winner whenever there is a value change. 
  useEffect(() => {
    const winner = determineWinner(elements);

    if (winner != null) {
      setWinner(winner);
    }
  }, [elements, determineWinner, setWinner])

  const handleSquareClick = useCallback(targetIndex => {
    // Skip if there is already a winner. 
    if (winner != null) {
      return;
    }

    // Skip if it's already filled. 
    if (elements[targetIndex] != null) {
      return;
    }

    const newElements = [...elements];
    newElements[targetIndex] = isXTurn ? 'X' : 'O';
    setElements(newElements);

    setIsXTurn(isXTurn => !isXTurn);
  }, [winner, elements, setElements, isXTurn, setIsXTurn]);

  const nextPlayer = isXTurn ? 'X' : 'O';
  const renderNextPlayer = () => {
    return (
      <div id="statusArea" className="status" style={instructionsStyle}>
        Next player: <span>{nextPlayer}</span>
      </div>
    );
  }
  const renderWinnerArea = () => {
    return winner == null
      ? null
      : <div
        id="winnerArea"
        className="winner"
        style={instructionsStyle}>
        Winner: <span>{winner}</span>
      </div>;
  }
  const renderGameBoard = () => {
    return (
      <div style={boardStyle}>
        <div className="board-row" style={rowStyle}>
          <Square content={elements[0]} onClick={() => handleSquareClick(0)} />
          <Square content={elements[1]} onClick={() => handleSquareClick(1)} />
          <Square content={elements[2]} onClick={() => handleSquareClick(2)} />
        </div>
        <div className="board-row" style={rowStyle}>
          <Square content={elements[3]} onClick={() => handleSquareClick(3)} />
          <Square content={elements[4]} onClick={() => handleSquareClick(4)} />
          <Square content={elements[5]} onClick={() => handleSquareClick(5)} />
        </div>
        <div className="board-row" style={rowStyle}>
          <Square content={elements[6]} onClick={() => handleSquareClick(6)} />
          <Square content={elements[7]} onClick={() => handleSquareClick(7)} />
          <Square content={elements[8]} onClick={() => handleSquareClick(8)} />
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="gameBoard">
      {renderNextPlayer()}
      {renderWinnerArea()}
      <button style={buttonStyle} onClick={handleReset}>Reset</button>
      {renderGameBoard()}
    </div>
  );
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);