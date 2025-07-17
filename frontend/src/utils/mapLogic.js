import { highlightTile } from "./canvas.js";



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


//Movement


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
            highlightTile(ctx , current.x , current.y , tileSize);
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