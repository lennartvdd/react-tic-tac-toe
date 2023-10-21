import { useState } from "react";

export default function BoardApp() {

  let square_size = 3;
  
  const [squares, setSquares] = useState([...Array(Math.pow(square_size,2))].map((x,i) => null));
  const [x, setX] = useState(true);
  const solutions = getSolutions(square_size);

  const boardState = {
    winner: calculateWinner(squares, solutions),
    status: null
  };

  if(boardState.winner) {
    boardState.status = "Winner: " + boardState.winner;
  } else {
    boardState.status = 'Next player: ' + (x ? 'X':'O');
  }

  function handleSquareClick(i) {
    if(boardState.winner) {
      return false;
    }
    const nextSquares = squares.slice();
    if(nextSquares[i] == "X" || nextSquares[i] == "O" ) {
      return;
    }
    nextSquares[i] = x ? "X" : "O";
    setSquares(nextSquares);
    setX(!x);
  }

  function handleResetClick() {
    boardState.status = null;
    boardState.winner = null;
    setSquares([...Array(Math.pow(square_size,2))].map((x,i) => null));
    setX(true);
  }

  return <Board squares={squares} boardState={boardState} handleSquareClick={handleSquareClick} handleResetClick={handleResetClick} />;
}

function Square({value, onSquareClick}) {
  return <div className="square" onClick={onSquareClick}>{value}</div>;
}
function BoardRow(props) {
  return <div className="board-row">{props.children}</div>;
}

function Board({squares, boardState, handleSquareClick, handleResetClick}) {

  let status = boardState.status;
  let winner = boardState.winner;
  let square_size = Math.sqrt(squares.length);
  const rows = [];
  for(let i = 0; i < square_size; i++) {
    let columns = [];
    for(let j = 0; j<square_size; j++) {
      let x = i*square_size+j;
      columns.push(<Square value={squares[x]} onSquareClick={() => handleSquareClick(x)}/>)
    }
    rows.push(<BoardRow>{columns}</BoardRow>);
  }
  return <>
    <div className="status">{status}</div>
    {rows}
    <button onClick={handleResetClick}>Reset</button>
  </>;
}

function calculateWinner(squares, solutions) 
{
  for(let i = 0; i < solutions.length; i++) {
    let solution = solutions[i];
    let pos = solution[0];
    let sign = squares[pos];
    let count = 0;
    
    if(sign != "X" && sign != "O") {
      continue;
    }
    
    for(let j = 1; j < solution.length; j++) {
      let pos = solution[j];
      if(sign === squares[pos]) {
        count++;
      }
    }
    if(count === solution.length-1) {
      return sign;
    }
  }
  return null
}

function getSolutions(square_size)
{
  //solutions: 
  //all horizontal, for example in 3x3: (0,1,2), (3,4,5), (6,7,8)
  //all vertical, for example in 3x3: (0,3,6), (1,4,7) (2,5,8)
  //all full diagonal, for example in 3x3: (0,4,8), (2,4,6)

  let horizontal_solutions = [];
  for(let x = 0; x < square_size; x++) {
    let solution = [];
    let s = x*square_size;
    for(let i = 0; i < square_size; i++) {
      solution.push(s+i);
    }
    horizontal_solutions.push(solution);
  }

  let vertical_solutions = [];
  for(let x = 0; x < square_size; x++) {
    let solution = [];
    for(let i = 0; i < square_size; i++) {
      let s = x + i*square_size;
      solution.push(s);
    }
    vertical_solutions.push(solution);
  }

  let diagonal_solutions = [];
  for(let d = 0; d < 2; d++) {
    let solution = [];
    for(let x = 0; x < square_size; x++) {
      let v = d ? ((x+1) * square_size - 1) - x : square_size * x + x;
      solution.push(v);
    }
    diagonal_solutions.push(solution);
  }

  let solutions = [].concat(horizontal_solutions, vertical_solutions, diagonal_solutions);
  return solutions;
}