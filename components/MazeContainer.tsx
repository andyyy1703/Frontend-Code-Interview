import Maze from '@/model/api/maze/maze';
import MazeComponent from './MazeComponent';

interface MazeContainerProps {
  mazeGroup: Maze[];
}

const MazeContainer: React.FC<MazeContainerProps> = ({ mazeGroup }) => {
  return (
    <div className="m-4">
      {mazeGroup.map((maze, index) => (
        <MazeComponent key={index} maze={maze} />
      ))}
    </div>
  );
};

export default MazeContainer;
