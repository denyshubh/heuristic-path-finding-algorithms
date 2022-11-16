import React, {Component} from 'react';
import Node from './Node/Node';
import {visualize} from '../Utility/visualize'
import {getInitialGrid, getNewGridWithWallToggled} from '../Utility/grid'

import '../App/App.css';

const TOTAL_ROWS = 20
const TOTAL_COLS = 50

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      startNode: [10,15],
      finishNode: [10,23],
      mouseIsPressed: false,
      startFlag: false,
      wallSelection: false
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(TOTAL_ROWS, TOTAL_COLS, this.state.startNode, this.state.finishNode);
    this.setState({grid});
    console.log("component di mount")
  }

  componentWillUnmount() {
    console.log("Component Unmount Called")
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  handleOnClick(row, col) {
    // If this is the first double click
    if (!this.state.startFlag) {
      const newGrid = getInitialGrid(TOTAL_ROWS, TOTAL_COLS, [row, col], this.state.finishNode);
      this.setState({grid: newGrid, startNode: [row, col], startFlag: true})}
    else {
      const newGrid = getInitialGrid(TOTAL_ROWS, TOTAL_COLS, this.state.startNode,[row, col]);
      this.setState({grid: newGrid, finishNode: [row, col], startFlag: false})
    }
  }

  handleButtonClick(algo) {
    visualize(algo, this.state)
  }
  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <>
        <button onClick={() => this.handleButtonClick('dijkstra')}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.handleButtonClick('greedyBfs')}>
          Visualize Greedy BFS Algorithm
        </button>
        <button onClick={() => this.handleButtonClick('astar')}>
          Visualize Astar Algorithm
        </button>
        <button onClick={() => this.handleButtonClick('bfs')}>
          Visualize BFS Algorithm
        </button>
        <button onClick={() => this.handleButtonClick('dfs')}>
          Visualize DFS Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      onClick={(row, col) => this.handleOnClick(row, col)}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}