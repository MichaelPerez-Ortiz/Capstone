import { useEffect , useRef , useState} from "react";
import {drawGrid , drawUnit , drawSpawnPoints} from "../utils/canvas.js";
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
    tileSize = 60
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
    } , [grid , units , activeUnit , spawnPoints , mapImageUrl , tileSize]);

    useEffect(() => {
        if(!grid || grid.length === 0)
            return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0 , 0 , canvas.width , canvas.height);

        drawGrid(ctx , grid , tileSize , mapImage);
        console.log("Grid data:" , grid);

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
    } , [grid , units , activeUnit , spawnPoints , mapImage]);


    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / tileSize);
        const y = Math.floor((event.clientY - rect.top) / tileSize);

        onTileClick(x , y);
    };

    const handleCanvasMouseMove = (event) => {
        if(!onTileHover)
            return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / tileSize);
        const y = Math.floor((event.clientY - rect.top) / tileSize);

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


