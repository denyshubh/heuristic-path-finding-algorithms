import './App.css';
//import Grid from '../Utility/Grid';
import PathfindingVisualizer from '../Components/PathFinding';
function App() {
  return (
    <div className="App">
     <PathfindingVisualizer 
           algo={'greedyBfs'}
     />
    </div>
  );
}

export default App;
