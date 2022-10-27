// function AStar(start, goal, currentPos) {
//     gScore = // func which calculate g score
//     hScore = // func which calculate h score
//     fScore = hScore(start) + gScore(start)
    
//     playerPosition = start    
//     open = []
    
//     getNeighbours = (position) = {
//         for each neighbour of position {
//             gScore = gScore(neighbour) + currentPos.gScore
//             hScore = hScore(neighbour)
//             fScore = gScore + hScore
//         }
//         return neighbours
//     }
    
//     while open is not empty {
       
//        if player == goal
//        break
     
//        neighbours = getNeighbours(currentPos)
//        open = [...open, ...neighbours] // update list of available tiles to check
       
//        tileToMove = getMinFScore(open) // get min fScore from available tiles
       
//        open.remove(tileToMove) // remove chosen tile from available tiles
       
//        player = tileToMove // move player
//     }
    
//     return false
// }