import { useEffect , useRef , useState} from "react";
import {drawGrid , drawUnit , drawSpawnPoints , drawValidPlacement , drawSelectedTile} from "../utils/canvas.js";
import { movementRange } from "../utils/mapLogic.js";



function BattleMap({
    grid ,
    units ,
    spawnPoints = [] ,
    activeUnit ,
    onTileClick ,
    onTileHover ,
    mapImageUrl = null ,
    width ,
    height ,
    tileSize = 80 ,
    validPlacement = [] ,
    selectedTile = null
}) {

    const canvasRef = useRef(null);
    const [mapImage , setMapImage] = useState(null);
    // const tileSize = 40;

    useEffect(() => {
        if(mapImageUrl) {
            const img = new Image ();
            img.src = mapImageUrl;
            img.onload = () => setMapImage(img);
        }
    } , [mapImageUrl]);

    useEffect(() => {
        if(!grid || grid.length === 0)
            return;

        const canvas = canvasRef.current;
        if(!canvas)
            return;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0 , 0 , canvas.width , canvas.height);

        drawGrid(ctx , grid , tileSize , mapImage);
        console.log("Grid data:" , grid);

        if(validPlacement && validPlacement.length > 0) {
            drawValidPlacement(ctx , validPlacement , tileSize);
        }

        if(selectedTile) {
            drawSelectedTile(ctx , selectedTile , tileSize);
        }

        if(spawnPoints.length > 0) {
            drawSpawnPoints(ctx , spawnPoints , tileSize);
        }

        if(activeUnit) {
            movementRange(ctx , activeUnit , grid , tileSize , units);
        }



        units.forEach(unit => {
            if(unit.position) {
                drawUnit(
                    ctx , 
                    unit ,
                    unit.position.x * tileSize ,
                    unit.position.y * tileSize ,
                    tileSize
                );
            }
        });
    } , [grid , units , activeUnit , spawnPoints , mapImage , tileSize , validPlacement , selectedTile]);


    const handleCanvasClick = (event) => {
        if(!canvasRef.current || !onTileClick)
            return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = ((event.clientX - rect.left) * scaleX);
        const mouseY = ((event.clientY - rect.top) * scaleY);

        const x = Math.floor(mouseX / tileSize);
        const y = Math.floor(mouseY / tileSize);

        if(x >= 0 && x < (grid[0]?.length || 0) &&
           y >= 0 && y < (grid?.length || 0)) {

            onTileClick(x , y);
         }
    };

    const handleCanvasMouseMove = (event) => {
        if(!onTileHover)
            return;

        const canvas = canvasRef.current;
        if(!canvas)
            return;

        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = ((event.clientX - rect.left) * scaleX);
        const mouseY = ((event.clientY - rect.top) * scaleY);
        

        const x = Math.floor(mouseX / tileSize);
        const y = Math.floor(mouseY / tileSize);

        if(grid && y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
            onTileHover(x , y);
        }
    };

    return(
        <canvas
            ref = {canvasRef}
            width = {width || grid[0]?.length * tileSize || 800}
            height = {height || grid?.length * tileSize || 600}
            onClick = {handleCanvasClick}
            onMouseMove = {handleCanvasMouseMove}
            className = "battleMap"
            />
    );
}

export default BattleMap;


