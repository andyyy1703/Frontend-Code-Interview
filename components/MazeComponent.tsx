import Maze from '@/model/api/maze/maze';
import { useEffect, useState } from 'react';
import { LuRat } from 'react-icons/lu';
import { FaCheese } from 'react-icons/fa';
import { get } from 'http';

interface MazeProps {
  maze: Maze;
}

export type MazeCell = 'start' | 'wall' | 'path' | 'end' | 'visited' | 'closed';
type CopyMaze = MazeCell[][];

const MazeComponent: React.FC<MazeProps> = ({ maze }) => {
  const [isSolving, setIsSolving] = useState(false);
  const [path, setPath] = useState<number[][]>([]);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number }>({ x: -1, y: -1 });
  const [mazeCopy, setMazeCopy] = useState<CopyMaze>(JSON.parse(JSON.stringify(maze)));

  useEffect(() => {
    const startPoint = getStartPoint();
    setCurrentPosition(startPoint);
    setPath([[startPoint.x, startPoint.y]]);
    solveMaze(currentPosition.x, currentPosition.y, currentPosition.x, currentPosition.y, mazeCopy);
  }, [maze, isSolving]);

  const solveMaze = async (x: number, y: number, prevX: number, prevY: number, mazeCopy: CopyMaze) => {
    if (!isSolving) return;
    if (mazeCopy[y][x] === 'end') {
      return;
    }

    const directions = [
      { x: 0, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    let moved = false;

    for (const direction of directions) {
      if (!isSolving) {
        return;
      }

      // 下一步位置上下左右
      const newX = x + direction.x;
      const newY = y + direction.y;

      // 如果超出邊界, 跳過
      if (newY < 0 || newY >= mazeCopy.length || newX < 0 || newX >= mazeCopy[0].length) {
        continue;
      }

      if (mazeCopy[newY][x] === 'closed') {
        mazeCopy[prevY][prevX] = 'path';
        continue;
      }

      // 如果跟上一步位置一樣, 跳過
      if (newX === prevX && newY === prevY && mazeCopy[newY][newX] !== 'path') {
        continue;
      }

      // 如果是走過的路或者牆, 跳過
      if (mazeCopy[newY][newX] === 'visited' || mazeCopy[newY][newX] === 'wall') {
        continue;
      }
      debugger;

      // 走過的點
      setPath((prevPath) => [...prevPath, [newX, newY]]);

      // 更新當前位置
      setCurrentPosition({ x: newX, y: newY });

      // 標記為已經走過的路
      setMazeCopy((prevMaze) => {
        const newMaze = [...prevMaze]; // 先複製一份原先的迷宮
        newMaze[newY][newX] = 'visited'; // 更新新的迷宮狀態
        return newMaze; // 返回新的迷宮狀態
      });

      // 如果找到終點，停止遞迴
      if (mazeCopy[newY][newX] === 'end') {
        return;
      }

      moved = true;

      await delay(100);
      await solveMaze(newX, newY, x, y, mazeCopy);
    }

    // 如果在這個位置沒有成功移動，則往回移動一步, 並把這個點標記為 'closed'
    if (!moved) {
      mazeCopy[y][x] = 'closed';
      setPath((prevPath) => prevPath.slice(0, -1));
      setCurrentPosition({ x: prevX, y: prevY });
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const startSolver = () => {
    setIsSolving(true);
  };

  const resetMaze = () => {
    setIsSolving(false);
    setCurrentPosition(getStartPoint());
    setPath([]);
    setMazeCopy(JSON.parse(JSON.stringify(maze)));
  };

  const getStartPoint = () => {
    const startPoint = maze.reduce(
      (acc, row, rowIndex) => {
        const colIndex = row.findIndex((cell) => cell === 'start');
        if (colIndex !== -1) {
          acc = { x: colIndex, y: rowIndex };
        }
        return acc;
      },
      { x: -1, y: -1 },
    );

    return startPoint;
  };

  const colorCell = (cell: string, x: number, y: number) => {
    if (cell === 'visited') {
      return 'bg-amber-200';
    }

    switch (cell) {
      case 'start':
        return 'bg-amber-200';
      case 'wall':
        return 'bg-green-800';
      case 'path':
        return 'bg-lime-50';
      case 'visited':
        return 'bg-lime-200';
      default:
        return '';
    }
  };

  console.log(mazeCopy);

  return (
    <div className="mt-4 border-b-2 pb-2 border-slate-400">
      {mazeCopy.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`w-12 h-12 flex justify-center align-middle ${colorCell(cell, cellIndex, rowIndex)}`}
            >
              {currentPosition.x === cellIndex && currentPosition.y === rowIndex && (
                <LuRat className="text-neutral-500 w-10 h-10" />
              )}
              {cell === 'end' && <FaCheese className="text-amber-400 w-10 h-10" />}
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4 text-center">
        {!isSolving ? (
          <button
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded transition duration-300 text-center"
            onClick={startSolver}
          >
            Start
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded transition duration-300"
            onClick={resetMaze}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default MazeComponent;
