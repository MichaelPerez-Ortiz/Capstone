import { useState , useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { getMapByChapter } from "../services/api.js";
import {saveGame} from "../services/localStorage.js";
import { isValidMove , terrainName , terrainDescription } from "../utils/mapLogic.js";
import BattleMap from "../components/BattleMap.jsx";
import UnitInfo from "../components/UnitInfo.jsx";


function BattlePage({selectedUnits , currenChapter , gameState , saveId , setGameState}) {
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

    const navigate = useNavigate();


    useEffect(() => {
        const fetchMapData = async () => {
    try {
        const mapData = await getMapByChapter(currenChapter);
        setMap(mapData);

        setTerrain(JSON.parse(JSON.stringify(mapData.grid)));

        if(mapData.backgroundImage) {
            setMapImage(mapData.backgroundImage);
        }


        //Unit Placement
        const playerUnits = selectedUnits.map((unit , index) => {
            const startY = mapData.grid.length - 2;
            const startX = 1 + index * 2;
            return {
                ...unit ,
                position: {x: startX , y: startY}
            };
        });

        const enemyUnits = mapData.enemyUnits.map(unit => ({
            ...unit ,
        }));

        setAllUnits([...playerUnits , ...enemyUnits]);


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

        if(currenChapter) {
            fetchMapData();
        }
    } , [currenChapter , selectedUnits]);



    //Actions
    const handleTileClick = (x , y) => {
        if(turn !== "player" || gameStatus !== "playing" || isPaused)
            return;

        if(selectedAction === "move" && activeUnit) {
            if(canvas.isValidMove(x , y , activeUnit , terrain , allUnits)) {
                moveUnit(activeUnit , x , y);
                setSelectedAction(null);
                return;
            }
        }


        if(selectedAction === "attack" && activeUnit) {
            if(canvas.isValidAttack(x , y)) {
                attackUnit(activeUnit , x , y);
                setSelectedAction(null);
                return;
            }
        }


        const clickedUnit = allUnits.find(unit =>
            unit.position &&
            unit.position.x === x &&
            unit.position.y === y &&
            unit.loyalty === "ally" &&
            !unit.hasMoved
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

            const updatedUnits = allUnits.map(unit => {
                if(unit._id === unit._id) {
                    return {...unit , hasMoved: true};
                }

                return unit;
            });

            setAllUnits(updatedUnits);
            setActiveUnit(null);
            setSelectedAction(null);

            const playerUnits = updatedUnits.filter(unit => unit.loyalty === "ally");
            const allMoved = playerUnits.every(unit => unit.hasMoved);

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
        const updatedUnits = allUnits.map(unit => {
            if(unit._id === unit._id) {
                return {...unit , position: {x , y}};
            }
            return unit;
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
                return unit;
            });

            setAllUnits(updatedUnits);

            setActionMessage(`${attacker.name} dealt ${damage} damage to ${targetUnit.name}`);
        } else {
            setActionMessage(`${attacker.name}'s attack missed`);
        }

        const finalUnits = allUnits.map(unit => {
            if(unit._id === attacker._id) {
                return {...unit , hasMoved: true};
            }
            return unit;
        });

        setAllUnits(finalUnits);
        setActiveUnit(null);

        const survivingUnits = finalUnits.filter(unit => unit.stats.hp > 0);
        setAllUnits(survivingUnits);

        checkGameStatus(survivingUnits);

        const playerUnits = survivingUnits.filter(unit => unit.loyalty === "ally");
        const allMoved = playerUnits.every(unit => unit.hasMoved);

        if(allMoved) {
            endPlayerTurn();
        }
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
                if(spawn.spawned < spawn.maxSpawns && newTurnCount % spawn.turnsPerSpawn === 0) {
                    const isOccupied = updatedUnits.some(unit => unit.position && unit.position.x === spawn.x && unit.position.y === spawn.y);

                    if(!isOccupied) {
                        const newEnemy = {
                            _id: `enemy_${Date.now()}_${index}` ,
                            name: spawn.unitName || "Reinforcement" ,
                            loyalty: "enemy" ,
                            class: spawn.unitClass || "infantry" ,
                            stats: spawn.unitStats || {
                                hp: 100 ,
                                atk: 50 ,
                                def: 30 ,
                                spd: 40 ,
                                mov: 3 //Change Later
                            },
                            position: {x: spawn.x , y: spawn.y}
                        };
                        updatedUnits = [...updatedUnits , newEnemy];

                        updatedSpawnPoints = updatedSpawnPoints.map((spawn , index) => {
                            if(index === index) {
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

            let nearestUnit = playerUnits[0];
            let minDistance = calculateDistance(enemy.position , nearestUnit.position);

            playerUnits.forEach(player => {
                const distance = calculateDistance(enemy.position , nearestUnit.position);
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

                    const updatedUnits = updatedUnits.map(unit => {
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

                    setActionMessage(`${enemy.name} dealt ${damage} damage to ${nearestUnit.name}`);
                } else {
                    setActionMessage(`${enemy.name}'s attack missed`);
                }
            } else {

                const direction = getDirectionToward(enemy.position , nearestUnit.position);
                const newPosition = {x: enemy.position.x + direction.x , y: enemy.position.y + direction.y};
                

                if(canvas.isValidMove(newPosition.x , newPosition.y , enemy , terrain , updatedUnits)) {
                    updatedUnits = updatedUnits.map(unit => {
                        if(unit._id === enemy._id) {
                            return {
                                ...unit ,
                                position: newPosition
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
            completedChapters: [...gameState.completedChapters , currenChapter] ,
            currenChapter: currenChapter + 1
        };
        saveGame(updatedGameState);
        setGameState(updatedGameState);

        setTimeout(() => {
            navigate(`/cutscene/${currenChapter}/outro`);
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

    if(loading) {
        return <div className = "battleLoading"> Loading Battle </div>;
    }

    return (
        <div className = "battlePage">
            <div className = "battleHeader">
                <h2> - Chapter {currenChapter} - {map?.name} </h2>
                <div className = "battleStatus">
                    <p> Turn: {currentTurn} ({turn === "player" ? "Player" : "Enemy"}) </p>
                    <p> Status: {gameStatus === "playing" ? "In Progress" : gameStatus} </p>
                </div>
            </div>

            <div className = "battleControls">
                <button className = "battleButton" onClick = {handlePause}> {isPaused ? "Resume" : "Pause"} </button>
                <button className = "battleButton" onClick = {handleSaveGame}> Save Game </button>
                <button className = "battleButton" onClick = {handleQuit}> Quit to World Map </button>
            </div>

            {actionMessage && (
                <div className = "battleMessage">
                    {actionMessage}
                </div>   
            )}

            <div className = "battleMain">
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
                        width = {terrain[0]?.length * 40 || 800}
                        height = {terrain?.length * 40 || 600}
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
                            <p><strong> Terrain </strong> {canvas.getTerrainName(terrain[hoveredTile.y][hoveredTile.x])}</p>
                            <p> {activeUnit ? canvas.getTerrainDescription(terrain[hoveredTile.y][hoveredTile.x] , activeUnit.class) :
                                canvas.getTerrainDescription(terrain[hoveredTile.y][hoveredTile.x])}</p>      
                        </div>
                    )}
                </>
                )}
            </div>

            {gameStatus === "victory" && (
                <div className = "battleVictoryPage">
                    <h2> Victory </h2>
                    <p> You Have Completed Chapter {currenChapter} </p>
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