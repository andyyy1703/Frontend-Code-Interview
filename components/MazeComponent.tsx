import Maze from '@/model/api/maze/maze';
import { useEffect, useState } from 'react';
import { LuRat } from 'react-icons/lu';
import { FaCheese } from 'react-icons/fa';

interface MazeProps {
  maze: Maze;
}

export type MazeCell = 'start' | 'wall' | 'path' | 'end' | 'visited' | 'closed';
type CopyMaze = MazeCell[][];

const MazeComponent: React.FC<MazeProps> = ({ maze }) => {
  const [isSolving, setIsSolving] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number }>({ x: -1, y: -1 });
  const [mazeCopy, setMazeCopy] = useState<CopyMaze>(JSON.parse(JSON.stringify(maze)));

  useEffect(() => {
    resetMaze();
  }, []);

  useEffect(() => {
    if (isSolving) {
      const pathStack: { x: number; y: number }[] = [];
      solveMaze(currentPosition.x, currentPosition.y, currentPosition.x, currentPosition.y, mazeCopy, pathStack);
    }
  }, [isSolving]);

  const solveMaze = async (
    x: number,
    y: number,
    prevX: number,
    prevY: number,
    mazeCopy: CopyMaze,
    pathStack: { x: number; y: number }[],
  ) => {
    if (!isSolving) return;
    if (mazeCopy[y][x] === 'end') {
      setIsSolving(false);
      return;
    }

    const directions = [
      { x: 0, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    let moved = false;
    let isEnd = false;

    for (const direction of directions) {
      if (!isSolving) {
        return;
      }

      const newX = x + direction.x;
      const newY = y + direction.y;

      if (newY < 0 || newY >= mazeCopy.length || newX < 0 || newX >= mazeCopy[0].length) {
        continue;
      }

      if (mazeCopy[newY][newX] === 'closed') {
        continue;
      }

      if (newX === prevX && newY === prevY && mazeCopy[newY][newX] !== 'path') {
        continue;
      }

      if (mazeCopy[newY][newX] === 'wall') {
        continue;
      }

      if (mazeCopy[newY][newX] === 'visited') {
        if (mazeCopy[y][x] === 'path') {
          setMazeCopy((prevMaze) => updateMazeCell(prevMaze, y, x, 'closed'));
          setMazeCopy((prevMaze) => updateMazeCell(prevMaze, newY, newX, 'path'));
        } else {
          continue;
        }
      }

      if (mazeCopy[newY][newX] === 'end' || mazeCopy[newY][newX] === 'start') {
        debugger;
        setCurrentPosition({ x: newX, y: newY });
        setIsSolving(false);
        isEnd = true;
        break;
      }

      if (mazeCopy[newY][newX] === 'path') {
        setMazeCopy((prevMaze) => updateMazeCell(prevMaze, newY, newX, 'visited'));
      }

      pathStack.push({ x: x, y: y });

      setCurrentPosition({ x: newX, y: newY });

      moved = true;
      if (moved) {
        await delay(100);
        await solveMaze(newX, newY, x, y, mazeCopy, pathStack);
      }
    }

    if (!moved) {
      let allDirectionsClosed = true;

      if (mazeCopy[y][x] === 'end' || mazeCopy[y][x] === 'start') {
        return;
      }

      for (const direction of directions) {
        const newX = x + direction.x;
        const newY = y + direction.y;

        if (newY < 0 || newY >= mazeCopy.length || newX < 0 || newX >= mazeCopy[0].length) {
          continue;
        }

        if (mazeCopy[newY][newX] === 'closed') {
          continue;
        }

        if (mazeCopy[newY][newX] === 'path') {
          pathStack.push({ x: x, y: y });
          setCurrentPosition({ x: newX, y: newY });
          await delay(100);
          await solveMaze(newX, newY, x, y, mazeCopy, pathStack);
        }
      }

      if (allDirectionsClosed) {
        setMazeCopy((prevMaze) => updateMazeCell(prevMaze, y, x, 'closed'));
        const lastPosition = pathStack.pop();
        if (lastPosition) {
          setCurrentPosition(lastPosition);
          await delay(100);
          await solveMaze(lastPosition.x, lastPosition.y, x, y, mazeCopy, pathStack);
        }
      }
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const startSolver = () => {
    setIsSolving(true);
  };

  const resetMaze = () => {
    setIsSolving(false);
    setCurrentPosition(getStartPoint());
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
    switch (cell) {
      case 'start':
        return 'bg-amber-200';
      case 'wall':
        return 'bg-green-800';
      case 'path':
        return 'bg-lime-50';
      case 'visited':
        return 'bg-amber-200';
      case 'closed':
        return 'bg-lime-50';
      default:
        return 'bg-lime-50';
    }
  };

  const updateMazeCell = (maze: CopyMaze, y: number, x: number, newValue: MazeCell): CopyMaze => {
    const newMaze = [...maze];
    newMaze[y][x] = newValue;
    return newMaze;
  };

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
                <LuRat className="text-neutral-500 w-12 h-12 bg-amber-200" />
              )}
              {cell === 'end' && currentPosition.x !== cellIndex && currentPosition.y !== rowIndex && (
                <FaCheese className="text-amber-400 w-10 h-10" />
              )}
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
