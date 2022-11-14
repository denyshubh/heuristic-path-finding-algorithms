function getInitialGrid(rows, cols, startNode, endNode){
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(col, row, startNode, endNode));
    }
    grid.push(currentRow);
  }
  return grid;
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const createNode = (col, row, startNode, endNode) => {
  return {
    col,
    row,
    isStart: row === startNode[0] && col === startNode[1],
    isFinish: row === endNode[0] && col === endNode[1],
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

export {getInitialGrid, getNewGridWithWallToggled}