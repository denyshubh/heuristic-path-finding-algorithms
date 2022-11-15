import { greedybfs } from "../Algorithms/GreedyBfs"
import {getNodesInShortestPathOrder} from "../Algorithms/NodePathTrace"
import {dijkstra } from '../Algorithms/Dijkstra';
import {astar} from '../Algorithms/Astar'

const animate = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
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

const animateShortestPath = (nodesInShortestPathOrder) =>{
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

export const visualize = (options, currentState) => {
    const {grid, startNode, finishNode} = currentState;
    const sNode = grid[startNode[0]][startNode[1]];
    const fNode = grid[finishNode[0]][finishNode[1]];
    let visitedNodesInOrder = undefined

    switch (options) {
        case 'greedyBfs':
            visitedNodesInOrder = greedybfs(grid, sNode, fNode);
            break
        case 'dijkstra':
            visitedNodesInOrder = dijkstra(grid, sNode, fNode);
            break
        case 'astar':
            visitedNodesInOrder = astar(grid, sNode, fNode);
            break
        default:
            visitedNodesInOrder = []

    }
    let nodesInShortestPathOrder =  getNodesInShortestPathOrder(fNode);
    animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }