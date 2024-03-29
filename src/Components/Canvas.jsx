import React, { useRef, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import {getRRTPath} from '../Algorithms/rrt'
import {getRRTStarPath} from '../Algorithms/rrtstar'

const HEIGHT = 650
const WIDTH = 1800

const CanvasClickStates = {
  NO_ACTION : "NO_ACTION",
  SET_START : "SET_START",
  SET_GOAL : "SET_GOAL",
  DRAW_OBSTACLE : "DRAW_OBSTACLE",
}

const Canvas = props => {
    const [obj, setObject] = useState({
        grid: Array(HEIGHT).fill().map(() => Array(WIDTH).fill(0)),
        startPos: [50, 26],
        goalPos: [400,450],
    })

    
    const canvasClickStateRef = useRef(CanvasClickStates.NO_ACTION); 
    const isMouseDownRef = useRef(false); 


    let [track, setTrack] = useState(0)
    let [track2, setTrack2] = useState(0)

    const [treePath, setTreePath] = useState({
		drawTree: [],
		drawFinalPath: [],
    tree: null,
	})
    
    const [textObj, setButtonText] = useState({
        startButton: "Start",
        setStartLocationButton : "Set Start Location",
        setGoalLocationButton: "Set Goal Location",
        setObstacleButton: "Set Obstacles ",
        // algoResult: "[View Result]",
        startCoords: "0 0",
        goalCoords: "0 0"
    })

    const canvasRef = useRef(null)
    const ctx = useRef(null)
    const rect = useRef(null)

    const drawTree = (ctx, treeNode) => {
        treeNode.forEach(element => {
            let [begin, end, i] = element

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
        });
        
    }
    
    const drawWaypoint = (ctx, treeNode) =>{
        treeNode.forEach(element => {
            let [begin, end, i] = element
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
        })   
    }

    const redraw = (X,Y, ctx) =>{
        console.log("Redraw called")
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.rect(X, Y, 50, 50);
        ctx.fill();
        ctx.stroke();  
    }
      
    const onCanvasClick = () => {
      if(canvasClickStateRef.current === CanvasClickStates.SET_START) {
        setStartClick();
      }else if(canvasClickStateRef.current === CanvasClickStates.SET_GOAL) {
        setGoalClick()
      }
    }

    const onCanvasMouseDown = (event) => {
      isMouseDownRef.current = true;
    }
    
    const onCanvasMouseUp = (event) => {
      isMouseDownRef.current = false;
    }

    const onCanvasMouseMove = (event) => {
      if(canvasClickStateRef.current === CanvasClickStates.DRAW_OBSTACLE && isMouseDownRef.current) {
        redraw(event.clientX - rect.current.left, event.clientY - rect.current.top, ctx.current);
      }
    }

    useEffect(()=>{
      if(canvasRef.current){
        canvasRef.current.addEventListener("click", onCanvasClick);
        canvasRef.current.addEventListener("mousedown", onCanvasMouseDown);
        canvasRef.current.addEventListener("mousemove", onCanvasMouseMove);
        canvasRef.current.addEventListener("mouseup", onCanvasMouseUp);
      }
      
      return () => {
        if(canvasRef.current){
          canvasRef.current.removeEventListener("click", onCanvasClick);
          canvasRef.current.removeEventListener("mousedown", onCanvasMouseDown);
          canvasRef.current.removeEventListener("mousemove", onCanvasMouseMove);
          canvasRef.current.removeEventListener("mouseup", onCanvasMouseUp);
      }
      }
    },[]);

    useEffect(() => {
      const canvas = canvasRef.current
      ctx.current = canvas.getContext('2d')
      rect.current = canvas.getBoundingClientRect();
      drawTree(ctx.current, treePath.drawTree)
      drawWaypoint(ctx.current, treePath.drawFinalPath)
    }, [drawTree, drawWaypoint, redraw, treePath])

    const convertCanvasTo2DGrid = () => {
        // convert canvas to 2D array
        const {grid} = obj
        const imageData = ctx.current.getImageData(0, 0, WIDTH, HEIGHT);
        for (let i = 0; i < imageData.data.length; i += 4){
            let x = (i / 4) % WIDTH;
            let y = Math.floor((i / 4) / WIDTH);
            if ((imageData.data[i] + imageData.data[i+1] === 0) && imageData.data[i+3] >= 120) {
                grid[y][x] = 1;
            }
        }    
        setObject({...obj, grid: grid})
    }

    const handleStartButtonClick = (selectedAlgo) => {

      convertCanvasTo2DGrid()
      
      const {grid, startPos, goalPos} = obj
      
      setButtonText((_oldValue) => ({..._oldValue, startButton: `Running: ${selectedAlgo}`}))
    
      let path = null
      if (selectedAlgo === 'rrt') {
        const maxNumIterations = 600
        const stepSize = 50
        path = getRRTPath(maxNumIterations, grid, stepSize, goalPos, startPos)
      } else if (selectedAlgo === 'rrtstar') {
        const maxNumIterations = 1500;
        const stepSize = 30;
        path = getRRTStarPath(maxNumIterations, grid, stepSize, goalPos, startPos)
      }
      setTreePath(path)
    }
    
    const handleSetStartButtonClick = () => {

        // canvasRef.current.removeEventListener("click",obstacleDrawClick);
        // canvasRef.current.removeEventListener("click", setGoalClick);
        // canvasRef.current.addEventListener("click", setStartClick);

       canvasClickStateRef.current = CanvasClickStates.SET_START;
        
       setButtonText((_oldValue)=> ({
        ..._oldValue, 
        setStartLocationButton: 'Double click grid', 
        setObstacleButton: 'Set Obstacles'
      }))
    }

    const setStartClick = () => {
        let { startPos, } = obj
        canvasRef.current.onclick = (e) => {
            console.log("Track One", track)
            track+=1;
            if (track === 1){
                let x = e.clientX - rect.current.left;
                if (x <= 0 || x >= WIDTH){ x = Math.floor(Math.random() * WIDTH - 1) + 1; }
                
                let y = e.clientY - rect.current.top;
                if (y <= 0 || y >= HEIGHT){ y = Math.floor(Math.random() * HEIGHT - 1) + 1; }

                startPos[0] = Math.round(x);
                startPos[1] = Math.round(y);

                // fill a circle
                ctx.current.beginPath();                  
                drawCrosshairs(startPos[0],startPos[1], "yellow", ctx.current);

                setButtonText((_oldValue)=> ({
                  ..._oldValue, 
                  setStartLocationButton: `Start Set!`, 
                 startCoords : `${startPos[0]} ${startPos[1]}`, 
                 startPos: startPos
                }))
            }
        }
        setObject((oldV)=>({...oldV, startPos: startPos}))
    }

    const handleSetGoalButtonClick = () => {
        // canvasRef.current.removeEventListener("click",obstacleDrawClick);
        // canvasRef.current.removeEventListener("click", setStartClick);
        // canvasRef.current.addEventListener("click", setGoalClick);

        canvasClickStateRef.current = CanvasClickStates.SET_GOAL;


        setButtonText((_oldValue)=> ({..._oldValue, 
            setGoalLocationButton: 'Double click grid',
            setObstacleButton: 'Set Obstacles' }))
    }
    
    const setGoalClick = () => {
        let { goalPos } = obj
        canvasRef.current.onclick = (e) => {
            console.log("Track Two", track2)
            track2+=1
            if (track2 === 1){
                let  x = e.clientX - rect.current.left;
                if (x <= 0 || x >= WIDTH){ x = Math.floor(Math.random() * WIDTH - 1) + 1; }
                
                let y = e.clientY - rect.current.top;
                if (y <= 0 || y >= HEIGHT){ y = Math.floor(Math.random() * HEIGHT - 1) + 1; } 
                
                goalPos[0] = Math.round(x);
                goalPos[1] = Math.round(y);
                // fill a circle
                ctx.current.beginPath();           
                
                drawCrosshairs(goalPos[0],goalPos[1], "green", ctx.current);
                drawGoalRegion(ctx.current, goalPos)

                setButtonText((_oldValue)=> ({
                  ..._oldValue, 
                  setStartLocationButton: `Goal Set!`, 
                  goalCoords : `${goalPos[0]} ${goalPos[1]}`, 
                  goalPos: goalPos
                }))
            }
          }
          setObject((oldV) => ({...oldV, goalPos: goalPos}));
    }

    const handleSetObstaclesButtonClick = () => {
      canvasClickStateRef.current = CanvasClickStates.DRAW_OBSTACLE;

        // canvasRef.current.removeEventListener("click", setStartClick);
        // canvasRef.current.removeEventListener("click", setGoalClick);
        // canvasRef.current.addEventListener("click", obstacleDrawClick);

        setButtonText((_oldValue)=> ({ ..._oldValue, setObstacleButton: 'Click once, move mouse, click to stop' }))
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

    const drawGoalRegion = (ctx, goalPos) => {
      ctx.beginPath();
      ctx.arc(goalPos[0], goalPos[1], 30, 0, 2 * Math.PI);
      ctx.strokeStyle = "green";
      ctx.stroke();
    }

    return (
        <>
        <div className="App">
        <Button id="start" variant="outline-success" onClick={() => handleStartButtonClick(props.algo)}> {textObj.startButton} </Button>
        <h3> | </h3>
        <Button id="setStart" variant="outline-primary" onClick={() => handleSetStartButtonClick()}>{textObj.setStartLocationButton}</Button>
        <h3 id="startCoords">{textObj.startCoords}</h3>
        <Button id="setGoal" variant="outline-danger" onClick={() => handleSetGoalButtonClick()}>{textObj.setGoalLocationButton}</Button>
        <h3 id="goalCoords">{textObj.goalCoords}</h3>
        <Button id="setObstacles" variant="outline-secondary" onClick={() => handleSetObstaclesButtonClick()}>{textObj.setObstacleButton}</Button>
        </div>
        {/* <div className="results">
            <h3 id="algoresults">{textObj.algoResult}</h3>
        </div> */}
        <div className="canvas">
            <canvas
            id="myCanvas"
            width={WIDTH}
            height={HEIGHT}
            style={{ border: "2px solid #24a0ed" }}
            ref={canvasRef}
            ></canvas>
        </div>
        </>
    )
}

export default Canvas