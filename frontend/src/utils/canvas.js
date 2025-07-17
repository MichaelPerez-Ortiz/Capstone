
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
                ctx.strokeRect(x * tileSize , y * tileSize , tileSize , tileSize);

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
    export const highlightTile = (ctx , x , y , tileSize , color = "rgba(255, 255, 0, 0.3)") => {
            ctx.fillStyle =color;
            ctx.fillRect(x * tileSize , y * tileSize , tileSize , tileSize);
        };






