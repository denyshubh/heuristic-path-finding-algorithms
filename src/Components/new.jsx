import Node from './Node/Node';
import {visualize} from '../Utility/visualize'
import React, { useEffect, useState } from 'react';
import {getInitialGrid, getNewGridWithWallToggled} from '../Utility/grid'

import '../App/App.css';

const TOTAL_ROWS = 15
const TOTAL_COLS = 30

export default function PathfindingVisualizer(algo){
    const [obj, setObject] = useState(
        {
            grid: [],
            startNode: [10,15],
            finishNode: [10,23],
            mouseIsPressed: false,
            startFlag: false,
            wallSelection: false,
        }
    )
    

    useEffect(() => {
        const grid = getInitialGrid(TOTAL_ROWS,
                TOTAL_COLS, 
                obj.startNode, 
                obj.finishNode
                );

        setObject({...obj, grid: grid})
      }, []);

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(obj.grid, row, col);
    setObject({...obj, grid: newGrid, mouseIsPressed: true});
  }

  const handleMouseEnter = (row, col) => {
    if (!obj.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(obj.grid, row, col);
    setObject({...obj,grid: newGrid});
  }

  const handleMouseUp= () => {
    setObject({...obj,mouseIsPressed: false});
  }

  const  handleOnClick = (row, col) => {
    // If this is the first double click
    if (!obj.startFlag) {
      const newGrid = getInitialGrid(TOTAL_ROWS, TOTAL_COLS, [row, col], obj.finishNode);
      setObject({...obj,grid: newGrid, startNode: [row, col], startFlag: true})}
    else {
      const newGrid = getInitialGrid(TOTAL_ROWS, TOTAL_COLS, obj.startNode,[row, col]);
      setObject({...obj,grid: newGrid, finishNode: [row, col], startFlag: false})
    }
  }
    return (
      <>
        <button onClick={() => visualize(algo, obj)}>
          Start
        </button>
        <div className="grid">
          {obj.grid.map((row, rowIdx) => {
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
                      onClick={(row, col) => handleOnClick(row, col)}
                      mouseIsPressed={obj.mouseIsPressed}
                      onMouseDown={(row, col) => handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                      onMouseUp={() => handleMouseUp()}
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