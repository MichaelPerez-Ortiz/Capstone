import { useState , useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { getMapByChapter } from "../services/api.js";
import {saveGame} from "../services/localStorage.js";
import { isValidMove , terrainName , terrainDescription } from "../utils/mapLogic.js";
import BattleMap from "../components/BattleMap.jsx";
import UnitInfo from "../components/UnitInfo.jsx";


function BattlePage({selectedUnits , currenChapter , gameState , saveId , setGameState}) {
    
}