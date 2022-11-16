export function bfs(grid, startNode, finishNode){
    const visitedNodesInOrder = []; // we will store the nodes visited in greedy bfs traversal order
    const queue = [startNode]
    const visited = Array.from(Array(grid.length), ()=> Array(grid[0].length).fill(false));
    visited[startNode.row][startNode.col] = true

    while(queue.length > 0) {
        console.log('h')
        const node = queue.shift(); // read first element from queue
        if (node.isWall) continue

        visitedNodesInOrder.push(node)
        node.isVisited = true; 
        
        if (node === finishNode) return visitedNodesInOrder;
        const {row, col} = node

        const delta = [[-1, 0], [0, -1], [1, 0], [0, 1]]
        delta.forEach((ele, index) => {
          if(isValid(visited, grid.length, grid[0].length, row+ele[0], col+ele[1])) {
            const childNode = grid[row+ele[0]][col+ele[1]]
            childNode.previousNode = node
            queue.push(childNode)
            visited[row+ele[0]][col+ele[1]] = true
          } 
        })
    }
    return visitedNodesInOrder
}

function isValid(vis, ROW, COL, row, col){
    // If cell lies out of bounds
    if (row < 0 || col < 0
        || row >= ROW || col >= COL)
        return false;
    // if the cell is already visisted
    if (vis[row][col]) return false
    // Otherwise
    return true;
}
