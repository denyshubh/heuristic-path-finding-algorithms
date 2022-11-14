export function greedybfs(grid, startNode, finishNode){
    const visitedNodesInOrder = []; // we will store the nodes visited in greedy bfs traversal order
    startNode.distance = calculate_heuristic(startNode, finishNode);
    const unvisitedNodes = getAllNodes(grid);

    while(unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift(); // removes the first element
        
        // If we encounter a wall, we skip it.
        if (closestNode.isWall) continue;
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;   // marking the node as visited

        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) return visitedNodesInOrder;

        updateDistanceOfUnvisitedNeighbors(closestNode, grid, finishNode);
    }
}
// distance between two points in 2D space.
// sqrt( (x2 - x)^2 + (y2-y)^2 )
function calculate_heuristic(currentNode, goalNode) {
    // The heuristic here is the Manhattan Distance
    // Could elaborate to offer more than one choice
    let dx = Math.abs(currentNode.row - goalNode.row)
    let dy = Math.abs(currentNode.col - goalNode.col)

    return dx+dy
}

function updateDistanceOfUnvisitedNeighbors(node, grid, goalNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    // Update heuristic distance of neighbouring nodes.
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = calculate_heuristic(neighbor, goalNode)
      neighbor.previousNode = node;
    }

  }

function getUnvisitedNeighbors(node, grid) {
    // returns the list of neighbours of current node
    const neighbors = [];
    const {col, row} = node;

    // const delta = [[-1, 0], [0, -1], [1, 0], [0, 1]]
    // delta.forEach((x, y) => neighbors.push(grid[row-x][col-y]))
    // up, left, down, right
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
}