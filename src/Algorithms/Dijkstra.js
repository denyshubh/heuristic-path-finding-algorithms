import Heap from 'heap';

export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while (!unvisitedNodes.empty()) {
      console.log('h')
      unvisitedNodes.heapify()
      const closestNode = unvisitedNodes.pop();
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;
      updateDistanceOfUnvisitedNeighbors(closestNode, grid);
    }
  }

  function updateDistanceOfUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  }

function isValid(ROW, COL, row, col){
    // If cell lies out of bounds
    if (row < 0 || col < 0
        || row >= ROW || col >= COL)
        return false;
    // Otherwise
    return true;
}
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    // up, left, down, right
    const delta = [[-1, 0], [0, -1], [1, 0], [0, 1]]
    delta.forEach((ele, _) => {
      if(isValid(grid.length, grid[0].length, row-ele[0], col-ele[1])) neighbors.push(grid[row-ele[0]][col-ele[1]])
    })
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  function getAllNodes(grid) {
    let heap = new Heap((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    for (const row of grid) {
      for (const node of row) {
        heap.push(node);
      }
    }
    return heap;
}