import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface CellProps {
  isMine: boolean;
  isOpen: boolean;
}

const Main = styled.div`
  display: flex;
  justify-content: center;
  flex-direction:column;
  align-items: center;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 30px);
  grid-gap: 1px;
`;

const Cell = styled.div<CellProps>`
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  background-color: ${(props) => (props.isOpen ? '#eee' : '#fff')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
`;

const App: React.FC = () => {
  const [board, setBoard] = useState<Array<Array<number>>>([]);
  const [openCells, setOpenCells] = useState<Array<Array<boolean>>>([]);
  const [flags, setFlags] = useState<Array<Array<boolean>>>(Array.from({ length: 10 }, () => Array(10).fill(false)));
  // const [mines, setMines] = useState<Array<[number, number]>>([]);

  const initializing = () => {
    const newBoard = Array.from({ length: 10 }, () => Array(10).fill(0));
    setBoard(newBoard);
    setOpenCells(Array.from({ length: 10 }, () => Array(10).fill(false)));
   
    // const nMine = [];
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      newBoard[x][y] = 9;
      // nMine.push([x,y]);
    }

    // setMines(nMines);
  };

  useEffect(() => {
    initializing();
  }, []);

  const reset = () => {
    initializing();
    setFlags(Array.from({ length: 10 }, () => Array(10).fill(false)));
  };

  const countMines = (row: number, col: number): number => {
    let count = 0;
    for (let i = Math.max(0, row - 1); i <= Math.min(9, row + 1); i++) {
      for (let j = Math.max(0, col - 1); j <= Math.min(9, col + 1); j++) {
        if (board[i][j] === 9) {    //
          count++;                  //
        }
      }
    }
    return count;
  };

  const checkWin = (): boolean => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (!openCells[i][j] && board[i][j] !== 9) {
          return false;
        }
      }
    }
    return true;
  };

  // const checkWin = (): boolean => {
  //   for (const [x, y] of mines) {
  //     if (!flags[x][y]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  

  // const poop = (x: number, y:number): any[] => {
  //   let result: any[] = [];
  //   if(board[x][y] === 0){
  //     result.push({x, y});
  //     result.push(poop(x-1,y));
  //     result.push(poop(x+1,y));
  //     result.push(poop(x,y-1));
  //     result.push(poop(x,y+1));
  //   }
  //   return result;
  // };


  const handleClick = (row: number, col: number) => {
    if (openCells[row][col] || flags[row][col]) {
      return;
    }

    if (board[row][col] === 9) {
      alert('Game Over!');
      reset();
      return;
    }

    if (board[row][col] === 0) {
      poop(row, col); 
    }

    if (checkWin()) {
      alert('Congratulations! You won!');
      reset();
    }
  };

  const poop = (x: number, y: number) => {
    if (x < 0 || x >= 10 || y < 0 || y >= 10 || openCells[x][y]) {
      return;
    }
    
    const newOpenCells = [...openCells];
    newOpenCells[x][y] = true;
    setOpenCells(newOpenCells);

    if (countMines(x,y) === 0) {
      const dx = [-1, 1, 0, 0];
      const dy = [0, 0, -1, 1];
  
      for (let i = 0; i < 4; i++) {
        poop(x + dx[i], y + dy[i]);
      }
    }
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, col: number) => {
    e.preventDefault();

    const newFlags = [...flags];
    newFlags[row][col] = !newFlags[row][col];
    setFlags(newFlags);
  };

  return (
    <Main>
      <h1>Minesweeper 💣</h1>
      <Container>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              isOpen={openCells[rowIndex][colIndex]}
              isMine={cell === 9}
              onClick={() => handleClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
            >
              {openCells[rowIndex][colIndex] ? (cell === 9 ? '💣' : countMines(rowIndex, colIndex)) : flags[rowIndex][colIndex] ? '🚩' : ''}
            </Cell>
          ))
        )}
      </Container>
    </Main>
  )
}
export default App;