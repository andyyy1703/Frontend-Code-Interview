import Maze from '@/model/api/maze/maze';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MazeContainer from '../../components/MazeContainer';
import Layout from '../../components/layout';

// export const getStaticProps = async () => {
//     try {
//         const { data } = await axios.get('/api/maze');
//       return {
//         props: {
//             m
//         },
//       };
//     } catch (error: any) {
//       console.log(error);
//     }
//     return {
//       props: {},
//     };
//   };

export default function FindTheCheese() {
  const [maze, setMaze] = useState<Maze[] | null>(null);
  const fetchMaze = async () => {
    const { data } = await axios.get('/api/maze');
    setMaze(data);
  };

  useEffect(() => {
    try {
      fetchMaze();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <>
      <Layout>
        <div className="p-4 max-w-[720px] mx-auto bg-white rounded shadow">
          <h1 className="font-bold text-4xl text-center">Find the Cheese</h1>
          <p className="mt-6 text-center">點擊‘開始’看看滑鼠如何使用 DFS 找到起司！</p>
          {maze && <MazeContainer mazeGroup={maze} />}
        </div>
      </Layout>
    </>
  );
}
