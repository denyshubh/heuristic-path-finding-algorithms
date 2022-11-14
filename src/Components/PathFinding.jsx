import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/Dijkstra';
import {getInitialGrid, getNewGridWithWallToggled} from '../Utility/grid'

import '../App/App.css';

const TOTAL_ROWS = 15
const TOTAL_COLS = 30

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

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid, startNode, finishNode} = this.state;
    const sNode = grid[startNode[0]][startNode[1]];
    const fNode = grid[finishNode[0]][finishNode[1]];
    const visitedNodesInOrder = dijkstra(grid, sNode, fNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(fNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
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