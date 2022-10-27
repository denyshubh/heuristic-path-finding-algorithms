import React, { useState, useEffect } from 'react';
import Node from '../Components/Node/Node'

function Grid() {
  // Declare a new state variable, which we'll call "count"
  const [grid, setgrid] = useState([]);
  
  return (
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
                // mouseIsPressed={mouseIsPressed}
                // onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                // onMouseEnter={(row, col) =>
                //   this.handleMouseEnter(row, col)
                // }
                // onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
            );
          })}
        </div>
      );
    })}
  </div>
  );
}

export default Grid;