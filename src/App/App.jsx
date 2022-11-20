import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import PathfindingVisualizer from '../Components/PathFinding';
import NavBar from '../Components/NavBar';
import Canvas from "../Components/Canvas";
import './App.css';

function App() {
  return (
      <Router>
        <NavBar />
        <Routes>
          <Route path='/rrt' element={<Canvas algo={'rrt'}/>} />
          <Route path='/rrtstar' element={<Canvas algo={'rrtstar'}/>} />
          <Route path='/astar' element={<PathfindingVisualizer algo={'astar'}/>} />
          <Route path='/bfs' element={<PathfindingVisualizer algo={'bfs'}/>} />
          <Route path='/dfs' element={<PathfindingVisualizer algo={'dfs'}/>} />
          <Route path='/greedyBfs' element={<PathfindingVisualizer algo={'greedyBfs'}/>} />
          <Route path='/dijkstra' element={<PathfindingVisualizer algo={'dijkstra'}/>} />
        </Routes>
      </Router>
  );
}

export default App;
