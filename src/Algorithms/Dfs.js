export function dfs(grid, startNode, finishNode){
    const visitedNodesInOrder = []; // we will store the nodes visited in greedy bfs traversal order
    // Initialize a stack of pairs and
    // push the starting cell into it
    var stack = [startNode];
    const visited = Array.from(Array(grid.length), ()=> Array(grid[0].length).fill(false));

    while(stack.length > 0) {
        console.log('h')
        const node = stack.pop(); // read first element from queue
        if (!node) continue
        const {row, col} = node

        if (node.isWall) continue
        if (node === finishNode) return visitedNodesInOrder;
        // Check if the current popped
        // cell is a valid cell or not

        if (!isValid(visited, grid.length, grid[0].length, row, col)) continue
        visited[row][col] = true
        
        visitedNodesInOrder.push(node)
        node.isVisited = true; 

        // Push all the adjacent cells

        const delta = [[-1, 0], [0, -1], [1, 0], [0, 1]]
        delta.forEach((ele, _) => {
                let x = row + ele[0]
                let y = col + ele[1]
                if (!(x < 0 || y < 0|| x >= grid.length || y >=  grid[0].length))
                    stack.push(grid[x][y])
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