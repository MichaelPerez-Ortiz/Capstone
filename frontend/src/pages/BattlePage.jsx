import { useState , useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { getMapByChapter } from "../services/api.js";
import {saveGame} from "../services/localStorage.js";
import { isValidMove , terrainName , terrainDescription } from "../utils/mapLogic.js";
import * as canvas from "../utils/canvas.js";
import BattleMap from "../components/BattleMap.jsx";
import UnitInfo from "../components/UnitInfo.jsx";
import { checkUnitUnlock , getRecruitableUnits , canRecruit , unlockUnit } from "../utils/unitUnlocks.js";

// const TILE_SIZE = 40;

function BattlePage({selectedUnits , currentChapter , gameState , saveId , setGameState}) {
    const [map , setMap] = useState(null);
    const [terrain , setTerrain] = useState([]);
    const [allUnits , setAllUnits] = useState([]);
    const [spawnPoints , setSpawnPoints] = useState([]);
    const [activeUnit , setActiveUnit] = useState(null);
    const [selectedAction , setSelectedAction] = useState(null);
    const [turn , setTurn] = useState("player");
    const [currentTurn , setCurrentTurn] = useState(1);
    const [gameStatus , setGameStatus] = useState("playing");
    const [loading , setLoading] = useState(true);
    const [isPaused , setIsPaused] = useState(false);
    const [mapImage , setMapImage] = useState(null);
    const [hoveredTile , setHoveredTile] = useState(null);
    const [actionMessage , setActionMessage] = useState("");
    const [isPlacingUnits , setIsPlacingUnits] = useState(false);
    const [unitsToPlace , setUnitsToPlace] = useState([]);
    const [placedUnits , setPlacedUnits] = useState([]);
    const [selectedTile , setSelectedTile] = useState(null);
    const [recruitableUnits , setRecruitableUnits] = useState([]);

    const navigate = useNavigate();

    const gridWidth = terrain[0]?.length;
    const gridHeight = terrain?.length;

    const maxCanvasWidth = Math.min(window.innerWidth * 0.85 , 1400);
    const maxCanvasHeight= Math.min(window.innerHeight * 0.75 , 900);

    const bestTileSize = Math.min(
        Math.floor(maxCanvasWidth / gridWidth) ,
        Math.floor(maxCanvasHeight / gridHeight) ,
        100
    );

    const canvasWidth = gridWidth * bestTileSize;
    const canvasHeight = gridHeight * bestTileSize;


    useEffect(() => {
        const fetchMapData = async () => {
    try {
            console.log("Selected units:", selectedUnits);

        const mapData = await getMapByChapter(currentChapter);
        setMap(mapData);

        setTerrain(JSON.parse(JSON.stringify(mapData.grid)));

        if(mapData.image) {
            setMapImage(mapData.image);
        }

        let enemyUnits = [];

        if(mapData.enemyUnits && mapData.enemyUnits.length > 0) {
            if(mapData.initialEnemies && mapData.initialEnemies.length > 0) {
                enemyUnits = mapData.initialEnemies.map(initialEnemy => {
            const enemyUnit = mapData.enemyUnits.find(unit =>
                unit._id === initialEnemy.unitId
            );

            if(enemyUnit) {
                return {
                    ...enemyUnit ,
                    position: initialEnemy.position ,
                    stats: initialEnemy.customStats || enemyUnit.stats
                };
            }
            return null;
            }).filter(Boolean);
        } else {
            enemyUnits = mapData.enemyUnits.map((unit , index) => {
                return {
                    ...unit ,
                    position : {x: 3 + index , y: 2}
                };
            });
        }
    }
    
    if(currentChapter === 1) {

        const preplacedAllies = [
            {
            _id: "688156ede3215acf2ca3c4e6" , 
            name: "Kirsa" ,
            loyalty: "ally" ,
            class: "infantry" ,
            stats: {
                hp: 23 , 
                atk: 6 ,
                def: 7 ,
                spd: 13 ,
                mov: 5
            },
            isUnlocked: true ,
            portrait: "https://res.cloudinary.com/navg-3d/image/upload/v1753278981/Kirsa_hvauef.png" ,
            position: {x: 2, y: 5} ,
            hasMoved: false
        },
        {
            _id: "6880f724d3e3fbb6df5b3378" ,
            name: "Kara" ,
            loyalty: "ally" ,
            class: "cavalry" ,
            stats: {
                hp: 22,
                atk: 7,
                def: 6,
                spd: 9,
                mov: 6
            },
            isUnlocked: true ,
            portrait: "https://res.cloudinary.com/navg-3d/image/upload/v1753278980/Kara_mvhecp.png" ,
            position: {x: 1, y: 6} ,
            hasMoved: false
        },
        {
            _id: "6880f88fd3e3fbb6df5b337c" ,
            name: "Avitus" ,
            loyalty: "ally" ,
            class: "infantry" ,
            stats: {
                hp: 30 , 
                atk: 14 ,
                def: 11 ,
                spd: 12 ,
                mov: 7
            },
            isUnlocked: true ,
            portrait: "https://res.cloudinary.com/navg-3d/image/upload/v1753278974/Avitus_o8rfay.png" ,
            position: {x: 3, y: 6} ,
            hasMoved: false
        }
        ];

    setAllUnits([...enemyUnits , ...preplacedAllies]);
    setIsPlacingUnits(false);
    setUnitsToPlace([]);
    setPlacedUnits([]);
} else {
    const uniqueUnits = [];
    const uniqueIds = new Set();
    selectedUnits.forEach(unit => {
        if(!uniqueIds.has(unit._id)) {
            uniqueIds.add(unit._id);
            uniqueUnits.push(unit);
        }
    });


    setUnitsToPlace(uniqueUnits);
    setPlacedUnits([]);
    setAllUnits([...enemyUnits]);
    setIsPlacingUnits(true);
}
     if(mapData.spawnPoints) {
            setSpawnPoints(mapData.spawnPoints.map(spawn => ({
                ...spawn ,
                spawned: 0
            })));
        }
    } catch(error) {
        console.error("Failed to Get Map Data" , error);
    } finally {
        setLoading(false);
    }
        };

        if(currentChapter) {
            fetchMapData();
        }
    } , [currentChapter , selectedUnits]);



    //Actions
    const handleTileClick = (x , y) => {
            console.log("Tile Clicked:" , x , y);
            if(isPlacingUnits) {
                if(isValidPlacement(x , y)) {
                    setSelectedTile({x , y});
                           console.log("unitsToPlace:", unitsToPlace);
        } else {
            console.log("Invalid Placement at:", {x, y});
        }
                
                return;
            }

        if(turn !== "player" || gameStatus !== "playing" || isPaused)
            return;

        const unitAtPosition = allUnits.find(unit => 
            unit.position && unit.position.x === x && unit.position.y === y
        );
        console.log("Unit at:" , unitAtPosition);
        

        if(selectedAction === "move" && activeUnit) {
            const movement = activeUnit.stats?.mov || 3;
            const distance = Math.abs(x - activeUnit.position.x) + Math.abs(y - activeUnit.position.y);
                
            if(distance > movement) {
                setActionMessage(`${activeUnit.name} Can Only Move ${movement} Tiles`);
                return;
            }
                if(isValidMove(x , y , activeUnit , terrain , allUnits)) {
                    moveUnit(activeUnit , x , y);
                    setSelectedAction(null);
                    return;
                } else {
                    setActionMessage("Invalid Move");
                }
            }

        if(selectedAction === "attack" && activeUnit) {
            if(isValidAttack(x , y)) {
                attackUnit(activeUnit , x , y);
                setSelectedAction(null);
                return;
            }
        }


        const clickedUnit = allUnits.find(unit =>
            unit.position &&
            unit.position.x === x &&
            unit.position.y === y
        );

        if(clickedUnit) {
            setActiveUnit(clickedUnit);
            setSelectedAction(null);
            return;
        }
        setActiveUnit(null);
        setSelectedAction(null);
    };

    const handleTileHover = (x , y) => {
        setHoveredTile({x , y});
    };


    const handleUnitAction = (action , unit) => {
        if(action === "wait") {

            const updatedUnits = allUnits.map(u => {
                if(u._id === unit._id) {
                    return {...u, hasMoved: true};
                }

                return u;
            });

            setAllUnits(updatedUnits);
            setActiveUnit(null);
            setSelectedAction(null);

            const playerUnits = updatedUnits.filter(u => u.loyalty === "ally");
            const allMoved = playerUnits.every(u => u.hasMoved);

            if(allMoved) {
                endPlayerTurn();
            }
        } else {
            setSelectedAction(action);
        }
    };


    //Attacks

    const isValidAttack = (x , y) => {
        if(y < 0 || y >= terrain.length || x < 0 || x >= terrain[y].length) {
            return false;
        }

        const targetUnit = allUnits.find(unit =>  unit.position && unit.position.x === x && unit.position.y === y && unit.loyalty !== activeUnit.loyalty);

        if(!targetUnit) {
            return false;
        }

        const dx = Math.abs(x - activeUnit.position.x);
        const dy = Math.abs(y - activeUnit.position.y);

        return dx + dy <= 1;
    };

    const moveUnit =(unit , x , y) => {
        const updatedUnits = allUnits.map(u => {
            if(u._id === unit._id) {
                return {...u , position: {x , y}};
            }
            return u;
        });
        setAllUnits(updatedUnits);
    };

    const attackUnit = (attacker , targetX , targetY) => {
        const targetUnit = allUnits.find(unit => unit.position && unit.position.x === targetX && unit.position.y === targetY);

        if(!targetUnit)
            return;


        //Accuracy Penalty
        const attackerTerrain = terrain[attacker.position.y][attacker.position.x];
        const isAttackerOnSand = attackerTerrain === 2 && attacker.class !== "flyer";

        const accuracyPenalty = isAttackerOnSand ? 0.8 : 1.0;

        const baseHitCHance = 0.9;
        const finalHitChance =  baseHitCHance * accuracyPenalty;

        const attackHits = Math.random() < finalHitChance;

        if(attackHits) {
            const damage = Math.max(1 , attacker.stats.atk - Math.floor(targetUnit.stats.def / 2));

            const updatedUnits = allUnits.map(unit => {
                if(unit._id === targetUnit._id) {
                    const newHp = Math.max(0 , unit.stats.hp - damage);
                    return {
                        ...unit ,
                        stats: {
                            ...unit.stats ,
                            hp: newHp
                        }
                    };
                }
                if(unit._id === attacker._id) {
                    return {...unit , hasMoved: true};
                }
                return unit;
            });

            const survivingUnits = updatedUnits.filter(unit => unit.stats.hp > 0);

            setAllUnits(survivingUnits);

            setActionMessage(`${attacker.name} dealt ${damage} damage to ${targetUnit.name}`);

            checkGameStatus(survivingUnits);

            const playerUnits = survivingUnits.filter(unit => unit.loyalty === "ally");
            const allMoved = playerUnits.every(unit => unit.hasMoved);

            if(allMoved) {
                endPlayerTurn();
            }
        } else {
            const updatedUnits = allUnits.map(unit => {
            if(unit._id === attacker._id) {
                return {...unit , hasMoved: true};
            }
            return unit;
        });
            setAllUnits(updatedUnits);
            setActionMessage(`${attacker.name}'s attack missed`);

            const playerUnits = updatedUnits.filter(unit => unit.loyalty === "ally");
            const allMoved = playerUnits.every(unit => unit.hasMoved);
            if(allMoved) {
                endPlayerTurn();
            }
        }
        setActiveUnit(null);
    };

    const endPlayerTurn = () => {
        setTurn("enemy");
        setTimeout(executeEnemyTurn , 1000);
    };

    const executeEnemyTurn = () => {
        const newTurnCount = currentTurn + 1;
        setCurrentTurn(newTurnCount);

        //Enemy Spawn Points

        let updatedUnits = [...allUnits];
        let updatedSpawnPoints = [...spawnPoints];

        if(spawnPoints.length > 0) {
            spawnPoints.forEach((spawn , index) => {
                if(spawn.spawned < spawn.maxSpawns && newTurnCount % spawn.frequency === 0) {
                    const isOccupied = updatedUnits.some(unit => unit.position && unit.position.x === spawn.x && unit.position.y === spawn.y);

                    if(!isOccupied) {
                        const newEnemy = {
                            _id: `enemy_${Date.now()}_${index}` ,
                            name: spawn.unitName || "Reinforcement" ,
                            loyalty: "enemy" ,
                            class: spawn.unitClass || "infantry" ,
                            stats: spawn.unitStats || {
                                hp: 12 ,
                                atk: 5 ,
                                def: 3 ,
                                spd: 4 ,
                                mov: 3 //Change Later
                            },
                            position: {x: spawn.x , y: spawn.y}
                        };
                        updatedUnits = [...updatedUnits , newEnemy];

                        updatedSpawnPoints = updatedSpawnPoints.map((spawn , i) => {
                            if(i === index) {
                                return {...spawn , spawned: (spawn.spawned || 0) + 1};
                            }
                            return spawn;
                        });
                    }
                }
            });
            setSpawnPoints(updatedSpawnPoints);
        }


        //Enemy Ai

        const enemyUnits  = updatedUnits.filter(unit => unit.loyalty === "enemy");
        const playerUnits  = updatedUnits.filter(unit => unit.loyalty === "ally");

        if(playerUnits.length === 0) {
            setGameStatus("defeat");
            return;
        }

        enemyUnits.forEach(enemy => {
            if(!updatedUnits.find(unit => unit._id === enemy._id))
                return;

            if(playerUnits.length === 0)
                return;

            let nearestUnit = playerUnits[0];
            let minDistance = calculateDistance(enemy.position , nearestUnit.position);

            playerUnits.forEach(player => {
                const distance = calculateDistance(enemy.position , player.position);
                if(distance < minDistance) {
                    nearestUnit = player;
                    minDistance = distance;
                }
            });

            if(minDistance <= 1) {
                const enemyTerrain = terrain[enemy.position.y][enemy.position.x];
                const isEnemyOnSand = enemyTerrain === 2 && enemy.class !== "flyer";

        
                const accuracyPenalty = isEnemyOnSand ? 0.8 : 1.0;
                const baseHitCHance = 0.9;
                const finalHitChance =  baseHitCHance * accuracyPenalty;

                const attackHits = Math.random() < finalHitChance;

                if(attackHits) {
                    const damage = Math.max(1 , enemy.stats.atk - Math.floor(nearestUnit.stats.def / 2));

                    const newUpdatedUnits = updatedUnits.map(unit => {
                        if(unit._id === nearestUnit._id) {
                            const newHp = Math.max(0 , unit.stats.hp - damage);
                            return {
                                ...unit ,
                                stats: {
                                    ...unit.stats ,
                                    hp: newHp
                                }
                            };
                        }
                        return unit;
                    });
                    updatedUnits = newUpdatedUnits;

                    setActionMessage(`${enemy.name} dealt ${damage} damage to ${nearestUnit.name}`);
                } else {
                    setActionMessage(`${enemy.name}'s attack missed`);
                }
            } else {

                const enemyMovement = enemy.stats?.mov || 3;
                const direction = getDirectionToward(enemy.position , nearestUnit.position);
                
                let bestMove = enemy.position;
                for(let step = 1; step <= enemyMovement; step++) {
                    const newPosition = {
                        x: enemy.position.x + (direction.x * step), 
                        y: enemy.position.y + (direction.y * step)
                    };
                

                if(isValidMove(newPosition.x , newPosition.y , enemy , terrain , updatedUnits)) {
                    bestMove = newPosition
                } else {
                    break;
                }
            }
            if(bestMove.x !== enemy.position.x || bestMove.y !== enemy.position.y) {
                updatedUnits = updatedUnits.map(unit => {
                    if(unit._id === enemy._id) {
                    return {
                        ...unit ,
                        position: bestMove
                    };

                 }
                    return unit;
                });

            }
        }         
});
        
        updatedUnits = updatedUnits.filter(unit => unit.stats.hp > 0);

        setAllUnits(updatedUnits);
        checkGameStatus(updatedUnits);

        updatedUnits = updatedUnits.map(unit => {
            if(unit.loyalty === "ally") {
                return {...unit , hasMoved: false};
            }
            return unit;
        });
          setAllUnits(updatedUnits);

           setTurn("player")
     };

     const calculateDistance = (pos1 , pos2) => {
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
     };

     const getDirectionToward = (from , to) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        if(Math.abs(dx) > Math.abs(dy)) {
            return {x: dx > 0 ? 1 : -1 , y: 0};
        } else {
            return {x: 0 , y: dy > 0 ? 1 : -1};
        }
     };

     //Victory
     const checkGameStatus = (units) => {
        const enemyUnits = units.filter(unit => unit.loyalty === "enemy");
        const playerUnits = units.filter(unit => unit.loyalty === "ally");

        if(enemyUnits.length === 0) {
            setGameStatus("victory");
            handleVictory();
        } else if (playerUnits.length === 0) {
            setGameStatus("defeat");
        }
     };

     const handleVictory = () => {
        if(gameState && saveId) {
            const updatedGameState = {
            ...gameState ,
            completedChapters: [...gameState.completedChapters , currentChapter] ,
            currentChapter: currentChapter + 1
        };
        saveGame(updatedGameState , saveId);
        setGameState(updatedGameState);

        setTimeout(() => {
            navigate(`/cutscene/${currentChapter}/outro`);
        } , 2000);
     }
    };

    const handleSaveGame = () => {
        if(saveId && gameState) {
            const updatedGameState = {
                ...gameState ,
            };
            saveGame(updatedGameState);
            setGameState(updatedGameState);//Maybe let players save current battle too
        }
    };

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    const handleQuit = () => {
        navigate("/worldMap");
    };


    const isValidPlacement = (x , y) => {

        if(y < 0 || y >= terrain.length || x < 0 || x >= terrain[y].length) {
            return false;
        }

        const tileType = terrain[y][x];
        if(tileType === 1) {
            return false;
        }

        const unitAtPosition = allUnits.find(unit => 
            unit.position && unit.position.x === x && unit.position.y === y
        );

        if(unitAtPosition) {
            console.log("Unit already at position:", unitAtPosition);
            return false;
        }

        const placedUnitPos = placedUnits.find(unit => 
            unit.position && unit.position.x === x && unit.position.y === y

        );
        if(placedUnitPos) {
            return false;
        }

            const deploymentZone = Math.floor(terrain.length * 0.6);
            if(y < deploymentZone) {
                console.log("Outside Deployment Zone");
                return false;
            }
  console.log("Valid placement");
        return true;
    };

    const handleUnitPlacement = (unitToPlace) => {
        console.log("Placing Unit:" , unitToPlace.name , "at" , selectedTile);
        if(!selectedTile)
            return;

        const {x , y} = selectedTile;

        const placedUnit = {
            ...unitToPlace , 
            position: {x , y} ,
            hasMoved: false
        };

        const newPlacedUnits = [...placedUnits , placedUnit];
        setPlacedUnits(newPlacedUnits);
        console.log("New Placed Units:" , newPlacedUnits);

        const remainingUnits = unitsToPlace.filter(unit => unit._id !== unitToPlace._id)
        setUnitsToPlace(remainingUnits);
        console.log("Remaining Units to Place:" , remainingUnits.length);

        setSelectedTile(null);

        if(remainingUnits.length === 0) {
            setTimeout(() => {
                finishUnitPlacement(newPlacedUnits);
            } , 100);
        
    }
};

    const finishUnitPlacement = (finalPlacedUnits = placedUnits) => {
        console.log("Finishing Unit Placement:" , finalPlacedUnits);

        setAllUnits(prev => {
            const newUnits = [...prev , ...finalPlacedUnits];
            console.log("Units After Placement:" , newUnits);
            return newUnits;
        });
        setIsPlacingUnits(false);
        setUnitsToPlace([]);
        setPlacedUnits([]);
        setSelectedTile(null);
    };

    const getValidPlacement = () => {
        const validTiles = [];
        for (let y = 0; y < terrain.length; y++) {
            for (let x = 0; x < terrain[y].length; x++) {
                if(isValidPlacement(x , y)) {
                    validTiles.push({x , y});
                }
            }
        }
        return validTiles;
    };



    if(loading) {
        return <div className = "battleLoading"> Loading Battle </div>;
    }

    return (
        <div className = "battlePage">
            <div className = "battleHeader">
                <h2> - Chapter {currentChapter} - {map?.name} </h2>
                <div className = "battleStatus">
                    {isPlacingUnits ? (
                        <p> Place Units ({unitsToPlace.length} Remaining) </p>
                    ) : (
                    <>
                        <p> Turn: {currentTurn} ({turn === "player" ? "Player" : "Enemy"}) </p>
                        <p> Status: {gameStatus === "playing" ? "In Progress" : gameStatus} </p>
                    </>
                    )}
                </div>
            </div>
            {!isPlacingUnits && (

            <div className = "battleControls">
                <button className = "battleButton" onClick = {handlePause}> {isPaused ? "Resume" : "Pause"} </button>
                <button className = "battleButton" onClick = {handleSaveGame}> Save Game </button>
                <button className = "battleButton" onClick = {handleQuit}> Quit to World Map </button>
            </div>)}

            {actionMessage && (
                <div className = "battleMessage">
                    {actionMessage}
                </div>   
            )}

            <div className = "battleMain">
                {isPlacingUnits ? (
                    <>
                    <BattleMap
                        grid = {terrain}
                        units={[...allUnits , ...placedUnits]}
                        spawnPoints={spawnPoints}
                        activeUnit={null}
                        onTileClick={handleTileClick}
                        onTileHover={handleTileHover}
                        mapImageUrl={mapImage}
                        width = {canvasWidth}
                        height = {canvasHeight}
                        tileSize = {bestTileSize}
                        validPlacement = {getValidPlacement()}
                        selectedTile = {selectedTile}
                    />

                    {selectedTile && unitsToPlace.length > 0 && (
                        <div className = "unitPlacement">
                            <h3> Choose Unit</h3>
                            <div className = "unitPlacementList">
                                {unitsToPlace.map(unit => (
                                    <div key = {unit._id} className = "unitPlacementOption" onClick = {() => handleUnitPlacement(unit)}>
                                        <div style = {{
                                            width: "40px" ,
                                            height: "40px" ,
                                            overflow: "hidden" ,
                                            border: "2px solid #6b4423",
                                            position: "relative"
                                        }}>
                                        <img src = {unit.portrait} alt = {unit.name} 
                                        style = {{
                                            width: "65px" ,
                                            height: "60px" ,
                                            objectFit: "cover" ,
                                            position: "absolute" ,
                                            top: "-1px" ,
                                            left: "-12px"
                                        }}
                                        />
                                        </div>
                                        <span> {unit.name} </span>
                                        </div>
                                ))}
                            </div>

                            {unitsToPlace.length > 0 && (
                                <button onClick = {() => finishUnitPlacement()} className = "finishPlacement"> Finish </button>
                            )}
                        </div>
                    )}
                    </>
                ) : (
                    <>
                {isPaused ? (
                    <div className = "battlePause">
                        <h3> Paused </h3>
                        <button onClick = {() => setIsPaused(false)}> Resume </button>
                        <button onClick = {handleSaveGame}> Save Game </button>
                        <button onClick = {handleQuit}> Quit to World Map </button>
                    </div>
                ) : (
                    <>
                    <BattleMap
                        grid = {terrain}
                        units={allUnits}
                        spawnPoints={spawnPoints}
                        activeUnit={activeUnit}
                        onTileClick={handleTileClick}
                        onTileHover={handleTileHover}
                        mapImageUrl={mapImage}
                        width = {canvasWidth}
                        height = {canvasHeight}
                        tileSize = {bestTileSize}
                    />

                    {activeUnit && (
                        <div className = "battleUnitInfo">
                            <UnitInfo
                                unit={activeUnit}
                                onAction={handleUnitAction}
                            />
                        </div>
                    )}

                    {hoveredTile && terrain[hoveredTile.y] && (
                        <div className = "battleTile">
                            <p><strong> Terrain </strong> {terrainName(terrain[hoveredTile.y][hoveredTile.x])}</p>
                            <p> {activeUnit ? terrainDescription(terrain[hoveredTile.y][hoveredTile.x] , activeUnit.class) :
                                terrainDescription(terrain[hoveredTile.y][hoveredTile.x])}</p>      
                        </div>
                    )}
                </>
                )}
                </>
                )}
            </div>

            {gameStatus === "victory" && (
                <div className = "battleVictoryPage">
                    <h2> Victory </h2>
                    <p> You Have Completed Chapter {currentChapter} </p>
                </div>
            )}

            {gameStatus === "defeat" && (
                <div className = "battleDefeatPage">
                    <h2> Defeat </h2>
                    <p> You Have Been Defeated </p>
                    <button onClick = {handleQuit}> Return to World Map </button>
                </div>
            )}
        </div>
    );
}


export default BattlePage;