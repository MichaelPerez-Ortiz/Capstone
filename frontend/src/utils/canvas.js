
export const terrainMovCost = {
    0: 1 ,
    1: Infinity ,
    2: 2 ,
    3: Infinity ,
    4: 1 ,
};

export const terrainCost = (terrainType , unitClass) => {
    if(unitClass === "flyer") {
        return terrainType === 1 ? Infinity : 1;
    }

    return terrainMovCost[terrainType] || Infinity;
};

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


export const movementRange = (ctx , unit , grid , tileSize) => {

    if(!unit || !unit.position || !unit.stats) 
        return;

    const {x , y} = unit.position;
    const movRange = unit.stats.mov;

    const visited = new Set();
    const reachable = [{x , y, movLeft: movRange}];

    while(reachable.length > 0) {
        const current = reachable.shift();

        if(current.y < 0 || current.y >= grid.length || current.x < 0 || current.x >= grid[0].length) {
            continue;
        }

        const positionKey = `${current.x} , ${current.y}`;
        if(visited.has(positionKey))
            continue;
        visited.add(positionKey);
         

        if(current.x === x && current.y === y) {

        } else {
            ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
            ctx.fillRect(current.x * tileSize , current.y * tileSize , tileSize , tileSize);
        }

        const terrainType = grid[current.y][current.x];
        const moveCost = terrainCost(terrainType , unit.class);

        if(moveCost === Infinity)
            continue;

        const remainingMov = current.movLeft - moveCost;

        if(remainingMov >= 0) {
            const directions = [
                {dx: 0 , dy: -1} , //up
                {dx: 1 , dy: 0} , //right
                {dx: 0 , dy: 1} , //down
                {dx: -1 , dy: 0} , //left
            ];

            for(const dir of directions) {
                const newX = current.x + dir.dx;
                const newY = current.y + dir.dy;
                const newPositionKey = `${newX} , ${newY}`;

                if(!visited.has(newPositionKey)) {
                    reachable.push({x: newX , y: newY , movLeft: remainingMov});
                }
            }
        }
    }
};

export const isValidMove = (x , y , activeUnit , grid , units) => {
    if(y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) {
        return false;
    }

    const terrainType = grid[x][y];
    const moveCost = terrainCost(terrainType , activeUnit.class);

    if(moveCost === Infinity) {
        return false;
    }

    const isOccupied = units.some(unit => unit._id !== activeUnit._id && unit.position && unit.position.x === x && unit.position.y === y);

        if(isOccupied) {
            return false;
        }
    
        const {position , stats} = activeUnit;
        const startX = position.x;
        const startY = position.y;
        const maxMov = position.mov;

        const visited = new Set();
        const reachable = [{x: startX , y: startY , cost: 0}];

        while(reachable.length > 0) {
            const current = reachable.shift();

            if(current.x === x && current.y === y) {
                return current.cost <= maxMov;
            }

            const positionKey = `${current.x} , ${current.y}`;
            if(visited.has(positionKey))
                continue;
            visited.add(positionKey);

            const directions = [
                {dx: 0 , dy: -1} , //up
                {dx: 1 , dy: 0} , //right
                {dx: 0 , dy: 1} , //down
                {dx: -1 , dy: 0} , //left
            ];

             for(const dir of directions) {
                const newX = current.x + dir.dx;
                const newY = current.y + dir.dy;

                if(newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[0].length) {
                    continue;
                }

                const isTileOccupied = units.some(unit => unit.id !== activeUnit._id && unit.position && unit.position.x === newX && unit.position.y === newY);

                if(isTileOccupied)
                    continue;

                const tileTerrainType = grid[newY][newX];
                const moveCost = terrainCost(tileTerrainType , activeUnit.class);

                if(moveCost === Infinity)
                    continue;

                const newCost = current.cost + moveCost;

                if(newCost <= maxMov) {
                    reachable.push({x: newX , y: newY , cost: newCost});
                }
        }
}

    return false;
};


export const terrainName = (terrainType) => {
    switch(terrainType) {
        case 0: return "Grass";
        case 1: return "Walls";
        case 2: return "Sand";
        case 3: return "Water";
        case 4: return "Bridge";
        default: return "Unkown";
    }
};

export const terrainDescription = (terrainType , unitClass) => {
    const isFlyer = unitClass === "flyer";

    switch(terrainType) {
            case 0: return "Normal Movement for All Units";
            case 1: return "Impassable";
            case 2: return isFlyer ? "Normal Movement for Flying Units" : "Slows Movement(2MP)";
            case 3: return isFlyer ? "Normal Movement for Flying Units" : "Impassable for Non-Flying Units";
            case 4: return "Normal Movement for All Units";
            default: return "";
     }
};