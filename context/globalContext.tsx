import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import Maze from '@/model/api/maze/maze';

interface IGlobalData {
  maze: Maze[];
}

const GlobalDataContext = createContext<IGlobalData | undefined>(undefined);

export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
}

interface Props {
  children: ReactNode;
}

export function GlobalDataProvider({ children }: Props) {
  const [maze, setMaze] = useState<Maze[]>([]);

  useEffect(() => {
    async function fetchMaze() {
      try {
        const { data } = await axios.get('/api/maze');
        setMaze(data);
      } catch (error) {
        console.error('Error fetching maze:', error);
      }
    }

    fetchMaze();
  }, []);
  const globalData: IGlobalData = {
    maze,
  };

  return <GlobalDataContext.Provider value={globalData}>{children}</GlobalDataContext.Provider>;
}
