//tree node class
export class treeNode{
	constructor(locationX, locationY){
		this.locationX = locationX;
		this.locationY = locationY;
		this.children = [];
		this.parent = null;
	}
}

//RRT Algorithm class
export class RRTAlgorithm{
	constructor(start, goal, numIterations, grid, stepSize){
		this.randomTree = new treeNode(start[0], start[1]);			//root position
		this.goal = new treeNode(goal[0], goal[1]);					//goal position
		this.nearestNode = null;									//nearest Node
		this.iterations = numIterations;							//number of iterations
		this.grid = grid;											//the map
		this.rho = stepSize;										//length of each branch
		this.path_distance = 0;										//total path distance	
		this.nearestDist = 10000;									//distance to nearest Node
		this.numWaypoints = 0;										//number of waypoints
		this.Waypoints = [];										//the waypoints
		this.serializedTree = [];									//the serialized tree
		this.pathFound = false;										//trigger if a path is found
	}
	
	//add the node to the nearest node, and add goal if necessary
	insertNode(locationX, locationY){
		// look for the goal node
		if (locationX === this.goal.locationX){
			this.nearestNode.children.push(this.goal);
			this.goal.parent = this.nearestNode;
			this.pathFound = true;
		} else{
			const tempNode = new treeNode(locationX,locationY);
			this.nearestNode.children.push(tempNode);
			tempNode.parent = this.nearestNode;
		}
	}
	
	// sample a random point within grid limits
	// Sampling: It randomly samples a state Zrand ∊ Xfree from the obstacle-free configuration space.
	sampling(){
		const x = Math.floor(Math.random() * this.grid[0].length-1) + 1;
		const y = Math.floor(Math.random() * this.grid.length-1) + 1;
		return [x,y];
	}

	//steer a distance stepSize from start location to end location (keep in mind the grid limits)
	// Steer: The function Steer (Zrand, Znearest) solves for a control input u[0,T] 
	// that drives the system from x(0)=Zrand to x(T)=Znearest along 
	// the path x: [0,T] → X giving Znew at a distance Δq from Znearest towards 
	// Zrand where Δq is the incremental distance.
	steerToPoint(locationStart, locationEnd){
		const unitVector = this.unitVector(locationStart, locationEnd);
		const offset = [this.rho*unitVector[0], this.rho*unitVector[1]];

		let point = [locationStart.locationX + offset[0], locationStart.locationY + offset[1]];
		
		// check grid max limit  (x coordinate)
		if (point[0] >= this.grid[0].length) point[0] = this.grid[0].length-1;
		// check grid max limit  (y coordinate)
		if (point[1] >= this.grid.length) point[1] = this.grid.length-1;
	
		return point		
	}

    // Collision Check: The function Obstaclefree(x) determines whether a path x:[0,T] 
	// lies in the obstacle-free region Xfree for all t=0 to t=T.
    obstacleFree(locationStart, locationEnd){
		const unitVector = this.unitVector(locationStart, locationEnd);
		let samplePoint = [0.0, 0.0];

		// look for obstacle in the given length (rho)
		for (let i = 0; i < this.rho; i+=1){
			samplePoint[0] = Math.min(locationStart.locationX + i*unitVector[0], this.grid[0].length-1);
			samplePoint[1] = Math.min(locationStart.locationY + i*unitVector[1], this.grid.length-1);
			
			if (samplePoint[0] <= 0) samplePoint[0] = 0;
		
			if (samplePoint[1] <= 0) samplePoint[1] = 0;
			
			// grid value is 1 is there is an obstacle otherwise its 0.
			if (this.grid[Math.round(samplePoint[1])][Math.round(samplePoint[0])] === 1) return true;
			
		}
		return false;
	}

	//find the unit vector between node and a point
	unitVector(locationStart, locationEnd){
		const vector = [locationEnd[0] - locationStart.locationX, locationEnd[1] - locationStart.locationY];
		let euclidean_dist = Math.sqrt(Math.pow(vector[0],2) + Math.pow(vector[1],2));
		if (euclidean_dist < 1.0){ euclidean_dist = 1.0; }

		return [vector[0]/euclidean_dist, vector[1]/euclidean_dist];
	}	

	// find the nearest node from a given (unconnected) point (Euclidean distance)
	// Nearest Neighbor: The function Nearest(T, Zrand) returns the nearest node 
	// from T=(V, E) to Zrand in terms of the cost determined by the distance function.

	findNearestNeighbor(root, point){
		if (!root) return;

		const dist = this.distance(root, point);

		if (dist <= this.nearestDist){
			this.nearestNode = root;
			this.nearestDist = dist;
		}
		for (let i = 0; i <= root.children.length; i += 1){
			this.findNearestNeighbor(root.children[i], point);
		}
	}

	// Distance: This function returns the cost of the path between two states assuming the 
	// region between them is obstacle free. 
	// The cost is in terms of Euclidean distance.
    distance(node1, point){
		return Math.sqrt(Math.pow(node1.locationX - point[0], 2) + Math.pow(node1.locationY - point[1], 2));
	}
	
	//check if goal reached within step size
	goalFound(point){
		if (this.distance(this.goal, point) <= this.rho) return true
		return false;
	}

	//reset nearestNode and nearestDistance
	resetNearestValues(){
		this.nearestNode = null;
		this.nearestDist = 10000;
	}

	//retrace path from goal to start
    retraceRRTPath(goal){
        if (goal.locationX === this.randomTree.locationX){
			const start = [this.randomTree.locationX, this.randomTree.locationY];
			this.Waypoints.push(start);
			this.Waypoints.push(start);
			return;
		}
        this.numWaypoints += 1;
        const currentPoint = [goal.locationX, goal.locationY];
        this.Waypoints.push(currentPoint);
        this.path_distance += this.rho;
        this.retraceRRTPath(goal.parent);
	}

}

export function getRRTPath(numIterations, grid, stepSize, goalPos, startPos) {
	
	const pathTraversed = []
	const pathToGoalNode = []

    //run the RRT algorithm        
    const rrt = new RRTAlgorithm(startPos, goalPos, numIterations, grid, stepSize);
    let counter = 0
    for (let i = 0; i < rrt.iterations; i++){
        rrt.resetNearestValues();   // setting nearest node to null and distance to 1000

        const point = rrt.sampling();   // 

        rrt.findNearestNeighbor(rrt.randomTree, point);

        const newPt = rrt.steerToPoint(rrt.nearestNode, point);

        const bool = rrt.obstacleFree(rrt.nearestNode, newPt);

        if (bool === false){
            rrt.insertNode(newPt[0], newPt[1]);
            const begin = [rrt.nearestNode.locationX, rrt.nearestNode.locationY];
            pathTraversed.push([begin, newPt, i]);
            //if goal found, append goal to path and break
            if (rrt.goalFound(newPt) === true){
                rrt.insertNode(goalPos[0],goalPos[1]);
                rrt.retraceRRTPath(rrt.goal);
                counter = i;
                break;
            }   
        }
    }

    if (rrt.pathFound === true){
        for (let i = 0; i <= rrt.Waypoints.length-2; i++){
           pathToGoalNode.push([rrt.Waypoints[i], rrt.Waypoints[i+1], i+counter]);
        }
    }

	return {
		drawTree: pathTraversed,
		drawFinalPath: pathToGoalNode,
		tree: rrt,
	}
}
