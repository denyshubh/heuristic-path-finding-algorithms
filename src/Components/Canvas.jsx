import React, { useRef, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import {RRTAlgorithm} from '../Algorithms/rrt'
//import {RRTStarAlgorithm} from '../Algorithms/rrtstar'

const HEIGHT = 650
const WIDTH = 1800

const Canvas = props => {
    const [obj, setObject] = useState({
        grid: Array(HEIGHT).fill().map(() => Array(WIDTH).fill(0)),
        startPos: [50,50],
        goalPos: [100,100],
        track: 0,
        track2: 0,
        mouseDown: false,
    })

    const [textObj, setButtonText] = useState({
        startButton: "Start",
        setStartLocationButton : "Set Start Location",
        setGoalLocationButton: "Set Goal Location",
        setObstacleButton: "Set Obstacles ",
        algoResult: "[View Result]"
    })

    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const rectRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();

        ctx.current = ctxRef
        rect.current = rectRef
    }, [])

    const handleStartButtonClick = (selectedAlgo) => {
        const [grid, startPos, goalPos] = obj

        // setButtonText({...textObj, startButton: `Running: ${selectedAlgo}`})

        //process canvas (convert to 2D array)
        const imageData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
        console.log(imageData)
        for (let i = 0; i < imageData.data.length; i += 4){
            let x = (i / 4) % WIDTH;
            let y = Math.floor((i / 4) / WIDTH);
            if ((imageData.data[i] + imageData.data[i+1] === 0) && imageData.data[i+3] >= 120) {
                grid[y][x] = 1;
            }
        }

        console.log(imageData)
    
        //if using RRT
        if (selectedAlgo === "rrt"){
            //draw goal region
            ctx.beginPath();
            ctx.arc(goalPos[0], goalPos[1], 50, 0, 2 * Math.PI);
            ctx.strokeStyle = "green";
            ctx.stroke();

            // setButtonText({...textObj, setObstacleButton: "Obstacles Set!"})

            // setButtonText({...textObj, algoResult: "Please wait, calculating route!"})

            const numIterations = 600;
            const stepSize = 50;
            
            //run the RRT algorithm        
            const rrt = new RRTAlgorithm(startPos, goalPos, numIterations, grid, stepSize);
            let counter = 0
            for (let i = 0; i < rrt.iterations; i++){
                rrt.resetNearestValues();
                const point = rrt.sampleAPoint();
                rrt.findNearest(rrt.randomTree, point);
                const newPt = rrt.steerToPoint(rrt.nearestNode, point);
                const bool = rrt.isInObstacle(rrt.nearestNode, newPt);
                if (bool === false){
                    rrt.addChild(newPt[0], newPt[1]);
                    const begin = [rrt.nearestNode.locationX, rrt.nearestNode.locationY];
                    drawTree(ctx, begin, newPt, i);
                    //if goal found, append goal to path and break
                    if (rrt.goalFound(newPt) === true){
                        rrt.addChild(goalPos[0],goalPos[1]);
                        rrt.retraceRRTPath(rrt.goal);
                        counter = i;
                        break;
                    }   
                }
            }
    
            if (rrt.pathFound === true){
                for (let i = 0; i <= rrt.Waypoints.length-2; i++){
                   drawWaypoint(ctx, rrt.Waypoints[i], rrt.Waypoints[i+1], i+counter);
                }
                setButtonText({...textObj, algoResult: `Path found! No. Waypoints: ${rrt.numWaypoints.toString()} and Distance: ${rrt.path_distance.toString()}`})
            }
            else{
                setButtonText({...textObj, algoResult: `No path found, max limit of 600 iterations has been reached, try again!`})
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
    }
    
    const handleSetStartButtonClick = () => {
        canvas.removeEventListener("click",obstacleDrawClick);
        canvas.removeEventListener("click", setGoalClick);
        canvas.addEventListener("click", setStartClick);
        
        setButtonText({...textObj, 
            setStartLocationButton: 'Double click grid', 
            setObstacleButton: 'Set Obstacles'})
    }

    const setStartClick = () => {
        let {track, startPos, } = obj
        canvas.onclick = (e) => {
            track++;
            if (track === 1){
                let x = e.clientX - rect.left;
                if (x <= 0 || x >= WIDTH){ x = Math.floor(Math.random() * WIDTH - 1) + 1; }
                
                let y = e.clientY - rect.top;
                if (y <= 0 || y >= HEIGHT){ y = Math.floor(Math.random() * HEIGHT - 1) + 1; }

                startPos[0] = Math.round(x);
                startPos[1] = Math.round(y);

                // fill a circle
                ctx.beginPath();           
               
                drawCrosshairs(startPos[0],startPos[1],"yellow");

                setButtonText({...textObj, setStartLocationButton: `Start Set!`})
            }
        }
        setObject({...obj, track: track})
    }

    const handleSetGoalButtonClick = () => {
        canvas.removeEventListener("click",obstacleDrawClick);
        canvas.removeEventListener("click", setStartClick);
        canvas.addEventListener("click", setGoalClick);

        setButtonText({...textObj, 
            setGoalLocationButton: 'Double click grid',
            setObstacleButton: 'Set Obstacles' })
    }

    const setGoalClick = () => {
        let { goalPos, track2, } = obj
        canvas.onclick = (e) => {
            track2++;
            if (track2 === 1){
                let  x = e.clientX - rect.left;
                if (x <= 0 || x >= WIDTH){ x = Math.floor(Math.random() * WIDTH - 1) + 1; }
                
                let y = e.clientY - rect.top;
                if (y <= 0 || y >= HEIGHT){ y = Math.floor(Math.random() * HEIGHT - 1) + 1; } 
                
                goalPos[0] = Math.round(x);
                goalPos[1] = Math.round(y);
                // fill a circle
                ctx.beginPath();           

                drawCrosshairs(goalPos[0],goalPos[1], "green");
                setButtonText({...textObj, setGoalLocationButton: `Goal Set!`})
            }
          }
          setObject({...obj, track2: track2})
    }

    const handleSetObstaclesButtonClick = () => {
        canvas.removeEventListener("click", setStartClick);
        canvas.removeEventListener("click", setGoalClick);
        canvas.addEventListener("click", obstacleDrawClick);

        setButtonText({...textObj, setObstacleButton: 'Click once, move mouse, click to stop' })
    }

    const obstacleDrawClick = () => {
        const {isMouseDown} = obj
        canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            redraw(event.clientX - rect.left, event.clientY - rect.top);
        }});
        setObject({...obj, mouseDown: !isMouseDown})
    }

    const redraw = (X,Y) =>{
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.rect(X, Y, 50, 50);
        ctx.fill();
        ctx.stroke();  
    }

    const drawTree = (ctx, begin, end, i) => {
        setTimeout(() => {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(...begin);
            ctx.lineTo(...end);
            ctx.stroke();
            ctx.fillStyle = "red";
            ctx.beginPath(); 
            ctx.arc(begin[0], begin[1], 3, 0, 2 * Math.PI);
            ctx.fill();
            }, 15*i);
    }
    
    const drawWaypoint = (ctx, begin, end, i) =>{
        setTimeout(() => {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(...begin);
            ctx.lineTo(...end);
            ctx.stroke();
            ctx.fillStyle = "yellow";
            ctx.beginPath(); 
            ctx.arc(begin[0], begin[1], 3, 0, 2 * Math.PI);
            ctx.fill();
            let text = Math.round(begin[0]).toString() + ', ' + Math.round(begin[1]).toString();
            ctx.fillText(text, begin[0], begin[1]+10)}, 15*i);        
    }
    
    const drawPoint = (xpos,ypos,i) => {
        setTimeout(function(){
        ctx.beginPath();
        ctx.fillStyle = "red";   
        ctx.rect(xpos, ypos, 2, 2);   
        ctx.fill();   
        }, 1*i);
    }
    
    const drawCrosshairs = (x,y,colorSetting, ctx) => {
        x = Math.floor(x) + 0.5;
        y = Math.floor(y) + 0.5;
        ctx.strokeWidth = 5;
        
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x, y + 10);
        
        ctx.moveTo(x - 10,  y);
        ctx.lineTo(x + 10,  y);
        
        // Line color
        ctx.strokeStyle = colorSetting;
        ctx.stroke();    
    }

    return (
        <>
        <div className="App">
        <Button id="start" variant="outline-success" onClick={() => handleStartButtonClick(props.algo)}> {textObj.startButton} </Button>
        <h3> | </h3>
        <Button id="setStart" variant="outline-primary" onClick={() => handleSetStartButtonClick()}>{textObj.setStartLocationButton}</Button>
        <h3 id="startCoords">0 0</h3>
        <Button id="setGoal" variant="outline-danger" onClick={() => handleSetGoalButtonClick()}>{textObj.setGoalLocationButton}</Button>
        <h3 id="goalCoords">0 0</h3>
        <Button id="setObstacles" variant="outline-secondary" onClick={() => handleSetObstaclesButtonClick()}>{textObj.setObstacleButton}</Button>
        </div>
        <div className="results">
            <h3 id="algoresults">{textObj.algoResult}</h3>
        </div>
        <div className="canvas">
            <canvas
            id="myCanvas"
            width={1800}
            height={650}
            style={{ border: "2px solid #24a0ed" }}
            ref={canvasRef}
            ></canvas>
        </div>
        </>
    )
}

export default Canvas