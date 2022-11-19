//import required classes
import {RRTAlgorithm} from "./rrt.js";

export class RRTStarAlgorithm extends RRTAlgorithm{
    constructor(start, goal, numIterations, grid, stepSize){
        super(start, goal, numIterations, grid, stepSize);
        this.searchRadius = this.rho*2;                                                           //neighbourhood search radius          
        this.neighbouringNodes = [];                                                              //neighbouring nodes
        this.goalArray = [goal[0], goal[1]];                                                      //goal array
        this.goalCosts = [10000];                                                                 //costs to goal                  
        this.ellipseAngle = Math.atan2(goal[1]-start[1], goal[0]-start[0]);                       //ellipse angle          
        this.xCenterEllipse = 0.5*(start[0]+goal[0]);                                             //x center ellipse
        this.yCenterEllipse = 0.5*(start[1]+goal[1]);                                             //y center ellipse  
        this.c_min = Math.sqrt(Math.pow(goal[1]-start[1],2) + Math.pow(goal[0]-start[0],2));      //min cost from start to goal
    }

    //new method: check if point is in ellipse
    checkIfInEllipse(pointX, pointY, c_best){
        var rad_x = c_best/2;
        var rad_y = Math.sqrt(Math.pow(c_best,2) - Math.pow(this.c_min,2))/2;
        if ( (((pointX - this.xCenterEllipse)*Math.cos(-this.ellipseAngle) + (pointY - this.yCenterEllipse)*Math.sin(-this.ellipseAngle))**2/rad_x**2 + 
        ((pointX - this.xCenterEllipse)*Math.sin(-this.ellipseAngle) + (pointY - this.yCenterEllipse)*Math.cos(-this.ellipseAngle))**2/rad_y**2 ) < 1){
            return true;
        }
        return false;          
    }
    

    //add a child (replaces addChild in RRT)
    addAChild(treeNode){
        if (treeNode.locationX == this.goal.locationX){
            this.nearestNode.children.push(this.goal);
            this.goal.parent = this.nearestNode;
            this.pathFound = true;
        }
        else{
            this.nearestNode.children.push(treeNode);
            treeNode.parent = this.nearestNode;
        }    
    }

    //reset values (overrides RRT)
	resetNearestValues(){
		this.nearestNode = null;
		this.nearestDist = 10000;
        this.neighbouringNodes = [];
	}    

    //new method: find neighbouring nodes
    findNeighbouringNodes(root,point){
		if (!root){
			return;
		}
        var dist = this.distance(root, point)
        //add to neighbouringNodes if within radius
        if (dist <= this.searchRadius && dist > 0.00001){
            this.neighbouringNodes.push(root);
        }
        for (let i = 0; i <= root.children.length; i += 1){
            this.findNeighbouringNodes(root.children[i], point)
        }    
    }

    //new method: find unique path length from root of a node
    findPathDistance(node){
        var costFromRoot = 0;
        while (node.locationX != this.randomTree.locationX){
            if (node.parent != null) {
                costFromRoot += this.distance(node, [node.parent.locationX, node.parent.locationY]);   
                node = node.parent;
            }
            else{
                costFromRoot = this.distance(node, [this.randomTree.locationX, this.randomTree.locationY]);
                node = this.randomTree;
                break;
            }
        }
        return costFromRoot;
    }

    //retracePath (replaces retraceRRTPath in RRT)
    retracePath(){
        this.numWaypoints = 0;
        this.Waypoints = [];
        var goalCost = 0;
        var goal = this.goal;
        while (goal.locationX != this.randomTree.locationX){
            this.numWaypoints += 1;
            var currentPoint = [goal.locationX, goal.locationY];
            this.Waypoints.push(currentPoint);
            goalCost += this.distance(goal, [goal.parent.locationX, goal.parent.locationY]);
            goal = goal.parent;
        }      
        this.goalCosts.push(goalCost);
    }

}

        // //if using RRTStar
        // if (selectedAlgo=="RRTStar"){
        //     //draw goal region
        //     ctx.beginPath();
        //     ctx.arc(goalPos[0], goalPos[1], 30, 0, 2 * Math.PI);
        //     ctx.strokeStyle = "green";
        //     ctx.stroke();
        //     setObstacleButton.innerHTML = 'Obstacles Set!';
        //     document.getElementById("algoresults").innerHTML = `Please wait, calculating route!`;
        //     var numIterations = 1500;
        //     var stepSize = 30;
    
        //     //run the Informed RRT* algorithm
        //     const rrtStar = new RRTStarAlgorithm(startPos, goalPos, numIterations, grid, stepSize); 
    
        //     for (let i = 0; i < rrtStar.iterations; i+=1){
        //         rrtStar.resetNearestValues();
        //         var point = rrtStar.sampleAPoint();
    
        //         if (rrtStar.pathFound == true){
        //             var c_best = rrtStar.goalCosts[rrtStar.goalCosts.length-1];
        //             if (rrtStar.checkIfInEllipse(point[0],point[1],c_best) == false){
        //                 continue;
        //             }
        //         }
    
        //         rrtStar.findNearest(rrtStar.randomTree, point);
        //         var newPt = rrtStar.steerToPoint(rrtStar.nearestNode, point);
        //         var bool = rrtStar.isInObstacle(rrtStar.nearestNode, newPt);  
        //         if (bool == false){
        //             rrtStar.findNeighbouringNodes(rrtStar.randomTree, newPt);
        //             var min_cost_node = rrtStar.nearestNode;
        //             var min_cost = rrtStar.findPathDistance(min_cost_node);
        //             min_cost += rrtStar.distance(rrtStar.nearestNode, newPt);
        //             //connect along minimum cost path 
        //             for (let i = 0; i < rrtStar.neighbouringNodes.length; i+=1){
        //                 var vertex_cost = rrtStar.findPathDistance(rrtStar.neighbouringNodes[i]);
        //                 vertex_cost += rrtStar.distance(rrtStar.neighbouringNodes[i], newPt);
        //                 if (rrtStar.isInObstacle(rrtStar.neighbouringNodes[i], newPt) == false && vertex_cost < min_cost){
        //                     min_cost_node = rrtStar.neighbouringNodes[i];
        //                     min_cost = vertex_cost
        //                 }
        //             }
        //             //update nearest node, and add to new node (if it clears obstacle), 
        //             //otherwise it'll add to the original nearest node (obstacle free)                  
        //             rrtStar.nearestNode = min_cost_node;
        //             const newNode = new treeNode(newPt[0],newPt[1]);
        //             rrtStar.addAChild(newNode); 
        //             var begin = [rrtStar.nearestNode.locationX, rrtStar.nearestNode.locationY]; 
        //             drawTree(ctx, begin, newPt, i);
        //             //rewire tree
        //             for (let i = 0; i < rrtStar.neighbouringNodes.length; i+=1){
        //                 var vertex_cost = min_cost;
        //                 vertex_cost += rrtStar.distance(rrtStar.neighbouringNodes[i], newPt);
        //                 if (rrtStar.isInObstacle(rrtStar.neighbouringNodes[i], newPt) == false && vertex_cost < rrtStar.findPathDistance(rrtStar.neighbouringNodes[i])){
        //                     rrtStar.neighbouringNodes[i].parent = newNode;
        //                 }
        //             } 
        //             //if goal found, append to path, trigger flag, let it sample more 
        //             if (rrtStar.goalFound(newPt) == true){
        //                 var projectedCost = rrtStar.findPathDistance(newNode) + rrtStar.distance(rrtStar.goal, newPt)
        //                 if (projectedCost < rrtStar.goalCosts[rrtStar.goalCosts.length - 1]){
        //                     rrtStar.addAChild(rrtStar.goal);
        //                     rrtStar.retracePath();
        //                     var start = [rrtStar.randomTree.locationX, rrtStar.randomTree.locationY];
        //                     rrtStar.Waypoints.push(start);
        //                     rrtStar.Waypoints.push(start);
        //                     var counter = i;
        //                     var c_best = rrtStar.goalCosts[rrtStar.goalCosts.length - 1];
        //                     var rad_x = c_best/2;
        //                     var rad_y = Math.sqrt(Math.pow(c_best,2) - Math.pow(rrtStar.c_min,2))/2;        
        //                     ctx.beginPath(); 
        //                     ctx.ellipse(rrtStar.xCenterEllipse, rrtStar.yCenterEllipse, rad_x, rad_y, rrtStar.ellipseAngle, 0, 2 * Math.PI);
        //                     ctx.stroke();
        //                 }
        //             }            
        //         }
        //     }          
    
        //         if (rrtStar.pathFound == true){
        //             var numRoutes = rrtStar.goalCosts.length - 1;
        //             rrtStar.goalCosts.shift();
        //             rrtStar.goalCosts = rrtStar.goalCosts.map(function(each_element){
        //                 return Number(each_element.toFixed(2));
        //             });
        //             for (let i = 0; i <= rrtStar.Waypoints.length-2; i+=1){
        //                drawWaypoint(ctx, rrtStar.Waypoints[i], rrtStar.Waypoints[i+1], i+counter);
        //             }
        //             document.getElementById("algoresults").innerHTML = `Path found! No. Waypoints: ` + rrtStar.numWaypoints.toString() + ` and   ` + ` Distance: ` + rrtStar.goalCosts + `, ` + numRoutes.toString() + ` paths available, displaying shortest calculated path!`;
        //         }
        //         else{
        //             document.getElementById("algoresults").innerHTML = `No path found, max limit of 1500 iterations has been reached, try again!`
        //         }
    
        //     }