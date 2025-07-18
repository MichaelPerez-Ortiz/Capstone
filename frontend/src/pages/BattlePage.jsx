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

    const handleTileClick = (x , y) => {
        if(turn !== "player" || gameStatus !== "playing" || isPaused)
            return;
    }
}