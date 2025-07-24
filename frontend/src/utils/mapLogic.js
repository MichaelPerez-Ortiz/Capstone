
export const drawGrid = (ctx , grid , tileSize , mapImage = null) => {

    if(mapImage && mapImage.complete) {
        ctx.drawImage(mapImage , 0 , 0 , grid[0].length * tileSize , grid.length *tileSize);

        for(let y = 0; y < grid.length; y++) {
            for(let x = 0; x < grid[y].length; x++) {
                ctx.strokeStyle = "rgba(0 , 0 , 0 , 0.2";
                ctx.lineWidth = 1;
                ctx.strokeRect(x * tileSize , y * tileSize , tileSize , tileSize);
            }
        }
    } else {
        const  terrainColors = {
            0: "#8BC34A" , //grass
            1: "#4a413e" , //walls
            2: "#F9E076" , //sand
            3: "#2196F3" , //water
            4: "#a16210" , //bridge
        };

         for(let y = 0; y < grid.length; y++) {
            for(let x = 0; x < grid[y].length; x++) {
                const terrainType = grid[y][x];

                ctx.fillStyle = terrainColors[terrainType] || "#717477";
                ctx.fillRect(x * tileSize , y * tileSize , tileSize , tileSize);

                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 1;
                ctx.strokeRect(x * tileSize , y * tileSize , tileSize , tileSize);
            }
        }
    }
};

export const drawSpawnPoints = (ctx , spawnPoints , tileSize) => {
    spawnPoints.forEach(spawn => {
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)"
        ctx.beginPath();
        ctx.arc(spawn.x * tileSize + tileSize / 2 , spawn.y * tileSize + tileSize / 2 , tileSize / 3 , 0 , Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = " rgba(255, 0, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();

        if(spawn.maxSpawn > 0) {
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${spawn.spawned || 0} / ${spawn.maxSpawns}` , 
                spawn.x * tileSize + tileSize / 2 ,
                spawn.y * tileSize + tileSize / 2
            );
        }
    });
};


//Units

export const drawUnit = (ctx , unit , x , y , size) => {
    const centerX = x + size / 2;
    const centerY = y + size / 2;

    ctx.fillStyle = unit.loyalty === "ally" ? "#2196F3" : "#FF5252";

    ctx.beginPath();
    ctx.arc(centerX , centerY , size / 3 , 0 , Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;

    switch(unit.class) {
        case "infantry":
            ctx.beginPath();
            ctx.moveTo(centerX - size / 4 , centerY + size / 4);
            ctx.lineTo(centerX + size / 4 , centerY - size / 4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX - size / 8 , centerY);
            ctx.lineTo(centerX + size / 8 , centerY);
            ctx.stroke();
            break;

        case "cavalry":
            ctx.beginPath();
            ctx.arc(centerX , centerY - size / 6 , size / 6 , 0 , Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(centerX , centerY - size / 12);
            ctx.lineTo(centerX , centerY + size / 6);
            ctx.stroke();
            break;

        case "flyer":
            ctx.beginPath();
            ctx.moveTo(centerX , centerY - size / 6);
            ctx.lineTo(centerX - size / 3 , centerY);
            ctx.lineTo(centerX , centerY + size / 6);
            ctx.stroke();
         
            ctx.beginPath();
            ctx.moveTo(centerX , centerY - size / 6);
            ctx.lineTo(centerX + size / 3 , centerY);
            ctx.lineTo(centerX , centerY + size / 6);
            ctx.stroke();
            break;

        default:
            ctx.beginPath();
            ctx.arc(centerX , centerY , size / 6 , 0 , Math.PI * 2);
            ctx.stroke();

    }
};

//Movement Range
export const movementRange = (ctx , unit , grid , tileSize , allUnits = []) => {
    if(!unit || !unit.position)
        return;

    const movement = unit.stats?.mov || 3;
    const {x: unitX , y : unitY} = unit.position;

    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y].length; x++) {
            const distance = Math.abs(x - unitX) + Math.abs(y - unitY);
            if(distance <= movement && distance > 0) {
                if(isValidMove(x , y , unit , grid , []))
                    highlightTile(ctx , x , y , tileSize , "rgba(0, 255, 0, 0.3)");
            }
        }
    }

    highlightTile(ctx , unitX , unitY , tileSize , "rgba(255, 255, 0, 0.5)");
};



    export const highlightTile = (ctx , x , y , tileSize , color = "rgba(255, 255, 0, 0.3)") => {
            ctx.fillStyle =color;
            ctx.fillRect(x * tileSize , y * tileSize , tileSize , tileSize);
        };


//World Map HTML Canvas

export const drawWorldMap = (ctx , width , height , maps , gameState) => {
    ctx.clearRect(0 , 0 , width , height);

    const gradient = ctx.createLinearGradient(0 , 0 , 0 , height);
        gradient.addColorStop(0 , "#87CEEB"); 
        gradient.addColorStop(0.7 , "#98FB98");
        gradient.addColorStop(1 , "#8FBC8F"); 

        ctx.fillStyle = gradient;
        ctx.fillRect(0 , 0 , width , height);

        drawTerrain(ctx , width , height);
        drawMapPaths(ctx , maps , width , height);

        //Node Link
        maps.forEach((map , index) => {
            let position;
            if(map.worldMapPos && map.worldMapPos.x !== undefined && map.worldMapPos.y !== undefined) {
                position = {
                    x: map.worldMapPos.x ,
                    y: map.worldMapPos.y
                };
            } else {
                position = getMapNodePos(index , maps.length , width , height);
            }
            drawMapNode(ctx , map , position , gameState);
        });
};

const drawTerrain = (ctx , width , height) => {
    ctx.fillStyle = "#8B7355";//Mountain
    ctx.beginPath();

    ctx.moveTo(width * 0.2 , height * 0.3);
    ctx.lineTo(width * 0.25 , height * 0.15);
    ctx.lineTo(width * 0.3 , height * 0.25);
    ctx.lineTo(width * 0.35 , height * 0.1);
    ctx.lineTo(width * 0.4 , height * 0.2);
    ctx.lineTo(width * 0.45 , height * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width * 0.6 , height * 0.4);
    ctx.lineTo(width * 0.65 , height * 0.25);
    ctx.lineTo(width * 0.7 , height * 0.35);
    ctx.lineTo(width * 0.75 , height * 0.2);
    ctx.lineTo(width * 0.8 , height * 0.4);
    ctx.closePath();
    ctx.fill();

    //Forests
    ctx.fillStyle = "#228B22";
    drawForest(ctx , width * 0.1 , height * 0.6, 80, 60);
    drawForest(ctx , width * 0.7 , height * 0.7, 100, 80);
    drawForest(ctx , width * 0.4 , height * 0.8, 120, 70);

    //Water
    ctx.strokeStyle = "#4169E1";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(width * 0.1 , height * 0.2);
    ctx.quadraticCurveTo(width * 0.3 , height * 0.4 , width * 0.5 , height * 0.3);
    ctx.quadraticCurveTo(width * 0.7 , height * 0.2 , width * 0.9 , height * 0.5);
    ctx.stroke();
    };
//TreeGroup
    const drawForest = (ctx , x , y , width , height) => {
    const treeCount = 15;

    for(let i = 0; i < treeCount; i++) {
        const treeX = x + (Math.random() * width);
        const treeY = y + (Math.random() * height);
        const treeSize = 8 + (Math.random() * 12);


        ctx.fillStyle = "#8B4513";
        ctx.fillRect(treeX - 2 , treeY + treeSize / 2 , 4 , treeSize / 2);


        ctx.fillStyle = "#228B22";
        ctx.beginPath();
        ctx.arc(treeX , treeY , treeSize / 2 , 0 , Math.PI * 2);
        ctx.fill();
    }
};

//Map Node Position
const getMapNodePos = (index , totalMaps , canvasWidth , canvasHeight) => {
    const padding = 80;
    const usableWidth = canvasWidth - (padding * 2);
    const usableHeight = canvasHeight - (padding * 2);

//Path
const pathPoints = [

    { x: 0.15 , y: 0.8 } , 
    { x: 0.3 , y: 0.6 } , 
    { x: 0.2 , y: 0.4 } , 
    { x: 0.4 , y: 0.3 } , 
    { x: 0.6 , y: 0.5 } , 
    { x: 0.8 , y: 0.3 } , 
    { x: 0.7 , y: 0.15 } , 
    { x: 0.85 , y: 0.1 } , 
];

    if (index < pathPoints.length) {
        return {
            x: padding + (pathPoints[index].x * usableWidth),
            y: padding + (pathPoints[index].y * usableHeight)
        };
        } else {
        
        const progress = index / (totalMaps - 1 || 1);
        return {
            x: padding + (progress * usableWidth),
            y: padding + (usableHeight * 0.5)
        };
     }
};


const drawMapPaths = (ctx , maps , canvasWidth , canvasHeight) => {
    if (maps.length < 2) 
        return;

            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = 4;
            ctx.setLineDash([10 , 5]);

            ctx.beginPath();

            const sortedMaps = [...maps].sort((a , b) => a.chapter - b.chapter);


            for (let i = 0; i < sortedMaps.length - 1; i++) {
                const currentMap = sortedMaps[i];
                const nextMap = sortedMaps[i + 1];

                let currentPos , nextPos;

                if(currentMap.worldMapPos && currentMap.worldMapPos.x !== undefined 
                    && currentMap.worldMapPos.y !== undefined) {
                        currentPos = {
                            x: currentMap.worldMapPos.x ,
                            y: currentMap.worldMapPos.y
                        };
                    } else {
                        const index = maps.findIndex(map => map._id === currentMap._id);
                        currentPos = getMapNodePos(index , maps.length , canvasWidth , canvasHeight);
                }

                    if(nextMap.worldMapPos && nextMap.worldMapPos.x !== undefined && nextMap.worldMapPos.y !== undefined) {
                        nextPos = {
                            x: nextMap.worldMapPos.x ,
                            y: nextMap.worldMapPos.y
                        };
                    } else {
                        const index = maps.findIndex(map => map._id === nextMap._id);
                        nextPos = getMapNodePos(index , maps.length , canvasWidth , canvasHeight);
                    }

            if (i === 0) {
                ctx.moveTo(currentPos.x , currentPos.y);
            }


            const midX = (currentPos.x + nextPos.x) / 2;
            const midY = (currentPos.y + nextPos.y) / 2;
            const controlX = midX + (Math.random() - 0.5) * 50;
            const controlY = midY + (Math.random() - 0.5) * 50;

            ctx.quadraticCurveTo(controlX , controlY , nextPos.x , nextPos.y);
        }

            ctx.stroke();
            ctx.setLineDash([]); 
    };

//Nodes
const drawMapNode = (ctx , map , position , gameState) => {
    const nodeRadius = 35;
    const { x , y } = position;


    const isCompleted = gameState.completedChapters.includes(map.chapter);
    const isAvailable = map.chapter <= gameState.currentChapter;
    const isLocked = !isAvailable;



  ctx.fillStyle = "rgba(0 , 0 , 0 , 0.3)";
  ctx.beginPath();
  ctx.arc(x + 3 , y + 3 , nodeRadius , 0 , Math.PI * 2);
  ctx.fill();
  
 
    if (isCompleted) {

        ctx.fillStyle = "#4CAF50";
    } else if (isAvailable) {

        ctx.fillStyle = "#2196F3";
    } else {

        ctx.fillStyle = "#9E9E9E";
    }
    
  ctx.beginPath();
  ctx.arc(x , y , nodeRadius , 0 , Math.PI * 2);
  ctx.fill();
  

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.stroke();
  
  //Chapter Number
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(map.chapter.toString() , x , y - 5);
  

    if (isCompleted) {
        ctx.fillStyle = "#FFD700"; 
        ctx.font = "16px Arial";
        ctx.fillText("⭐" , x , y + 12);//Star
    } else if (isLocked) {

        ctx.fillStyle = "#666666";
        ctx.font = "14px Arial";
        ctx.fillText("🔒" , x , y + 12);
    }
  
  //Map Name
  ctx.fillStyle = "#333333";
  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  const maxWidth = nodeRadius * 2;
  const text = map.name;
  

  const words = text.split(" ");
  let line = "";
  let lines = [];
  
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
    
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line);
  

  lines.forEach((line , index) => {
    ctx.fillText(line.trim(), x , y + nodeRadius + 20 + (index * 15));
  });
};

//Clicked Node
export const getClickedMapNode = (mouseX , mouseY , maps , canvasWidth , canvasHeight) => {
    const nodeRadius = 35;
  
  for (let i = 0; i < maps.length; i++) {
    let position;

    if(maps[i].worldMapPos && maps[i].worldMapPos.x !== undefined && maps[i].worldMapPos.y !== undefined) {
        position = {
           x: maps[i].worldMapPos.x ,
           y: maps[i].worldMapPos.y
    };
} else {
    position = getMapNodePos(i , maps.length , canvasWidth , canvasHeight);
}

    const distance = Math.sqrt(Math.pow(mouseX - position.x , 2) + Math.pow(mouseY - position.y , 2));
    
    if (distance <= nodeRadius) {
      return maps[i];
    }
  }
  
  return null;
};


export const isValidMove = (x , y , unit , terrain , allUnits) => {
    if(y < 0 || y >= terrain.length || x < 0 || x >= terrain[y].length) {
        return false;
    }

    const isOccupied = allUnits.some(otherUnit => 
        otherUnit.position &&
        otherUnit.position.x === x &&
        otherUnit.position.y === y &&
        otherUnit._id !== unit._id
    );
    if(isOccupied) {
        return false;
    }

    const terrainType = terrain[y][x];
    if(terrainType === 1) {
        return false;
    }

    if(terrainType === 3 && unit.class !== "flyer") {
        return false;
    }
    return true;
};

export const terrainName = (terrainType) => {
    const names = {
        0: "Grass" ,
        1: "Wall" ,
        2: "Sand" ,
        3: "Water" , 
        4: "Bridge"
    };
    return names[terrainType] || "unknown";
};

export const terrainDescription = (terrainType , unitClass = null) => {
    const descriptions = {
        0: "Normal Movement" ,
        1: "Impassable" ,
        2: unitClass === "flyer" ? "Normal Movement" : "Reduces Accuracy" , 
        3: unitClass === "flyer" ? " Normal Movement" : "Impassable to Ground Units" ,
        4: "Normal Movement"
    };
    return descriptions[terrainType] || "Unknown Terrain";
}