import { useState , useEffect , useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMaps , getWorldMap } from "../services/api.js";
import { drawWorldMap , getClickedMapNode } from "../utils/canvas.js";
import { loadGame, saveGame } from "../services/localStorage.js";


function WorldMapPage({setCurrentChapter , gameState , currentSaveId}) {

   console.log("WorldMapPage.jsx - currentSaveId prop:", currentSaveId);

  const [maps , setMaps] = useState([]);
  const [loading , setLoading] = useState(true);
  const [lockedMessage , setLockedMessage] = useState("");
  const [customMapImage , setCustomMapImage] =useState(null);
  const [localGameState , setLocalGameState] =useState(gameState);
  const navigate = useNavigate();
  const canvasRef = useRef(null);


  console.log("WorldMapPage render - gameState:", gameState);
  console.log("WorldMapPage render - loading:", loading);
  console.log("WorldMapPage render - maps:", maps);

useEffect(() => {
  if(!gameState) {
    const currentSaveId = localStorage.getItem("currentSaveId");
    if(currentSaveId) {
      const loadedGameState = loadGame(currentSaveId);
      if(loadedGameState) {
        setLocalGameState(loadedGameState);
        console.log("Loaded Game State from localStorage" , loadedGameState);
      } else {
        console.log("No Save Found");
      }
    } else {
      console.log("No Current Save ID");
    }
  }
} , [gameState , currentSaveId]);



  useEffect(() => {
    const fetchworldMap = async () => {
try {
   console.log("Fetching world map...");

      const data = await getWorldMap();
    
      if(data.imageUrl) {
        const img = new Image();
        img.src = data.imageUrl;
        img.onload = () => {
          setCustomMapImage(img);
        };
      }

      const mapsData = data.battleMaps || [];
      setMaps(mapsData);

    } catch(error) {
      console.error("Failed to Get World Map:" , error);
try {

    const mapsData = await getMaps();
    setMaps(mapsData);

    } catch(error) {
      console.error("Failed to Get Maps:" , error);
      setMaps([]);
    }

    } finally {
      setLoading(false);
    }
  };

  fetchworldMap();

} , []);


useEffect(() => {
  if(localGameState?.isNewSave && currentSaveId) {
    const updatedGameState = {
      ...localGameState ,
      isNewSave:false
    };
    saveGame(updatedGameState);
    setLocalGameState(updatedGameState);
  }
} , [localGameState , currentSaveId]);

//Draw Map

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

const currentGameState = gameState || localGameState;


useEffect(() => {
  if(!canvasRef.current)
    return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  const drawEmptyWorldMap = () => {
    console.log("Drawing empty world map")
    ctx.clearRect(0 , 0 , canvas.width , canvas.height);

    if(customMapImage) {//Uploaded Image
      ctx.drawImage(customMapImage , 0 , 0 , canvas.width , canvas.height);
    } else {

    const gradient = ctx.createLinearGradient(0 , 0 , 0 , canvas.height);
        gradient.addColorStop(0 , "#87CEEB"); 
        gradient.addColorStop(0.7 , "#98FB98");
        gradient.addColorStop(1 , "#8FBC8F"); 

        ctx.fillStyle = gradient;
        ctx.fillRect(0 , 0 , canvas.width , canvas.height);

        drawTerrain(ctx , canvas.width , canvas.height);
    }
       

      //Message

      ctx.fillStyle = "rgba(0 , 0 , 0 , 0.7)";
      ctx.fillRect(canvas.width / 2 - 150 , canvas.height / 2 - 40 , 300 , 80);
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("No Chapters Available" , canvas.width / 2 , canvas.height / 2);
      ctx.font = "16px Arial";
      ctx.fillText("Add Maps to See Chapter Nodes" , canvas.width / 2 , canvas.height / 2 + 25);
    };

    const drawOverworld = () => {
      if(!maps || maps.length === 0) {
        drawEmptyWorldMap();
      } else {
    try {

      if(customMapImage) {
        ctx.clearRect(0 , 0 , canvas.width , canvas.height);
        ctx.drawImage(customMapImage , 0 , 0 , canvas.width , canvas.height);

        if(maps && maps.length > 0 && currentGameState) {
          ctx.strokeStyle = "#8B4513";
          ctx.lineWidth = 4;
          ctx.setLineDash([10 , 5]);

          for(let i = 0; i < maps.length; i++) {
            const map = maps[i];
            const position = getMapNodePos ?
            getMapNodePos(i , map.length , canvas.width , canvas.height) : 
            {x: 80 + (i * (canvas.width - 160) / (maps.length - 1 || 1)) , y: canvas.height / 2};

            const nodeRadius = 35;
            const isCompleted = currentGameState.completedChapters.includes(map.chapter);
            const isAvailable = map.chapter <= currentGameState.currentChapter;
            const isLocked = !isAvailable;

            ctx.fillStyle = isCompleted ? "#4CAF50" : isAvailable ? "#2196F3" : "#9E9E9E"; 

            ctx.beginPath();
            ctx.arc(position.x , position.y , nodeRadius , 0 , Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 3;
            ctx.stroke();

             //Chapter Number
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(map.chapter.toString() , position.x , position.y - 5);
  

            if (isCompleted) {
                ctx.fillStyle = "#FFD700"; 
                ctx.font = "16px Arial";
                ctx.fillText("⭐" , position.x , position.y + 12);
            } else if (isLocked) {

                ctx.fillStyle = "#666666";
                ctx.font = "14px Arial";
                ctx.fillText("🔒" , position.x , position.y + 12);
            }

            ctx.fillStyle = "#333333";
            ctx.font = "bold 12px Arial";
            ctx.fillText(map.name , position.x , position.y , + nodeRadius + 20);
          }
        }
      } else {

        drawWorldMap(ctx , canvas.width , canvas.height , maps , currentGameState);
      }
        
      } catch(error) {
        console.error("Error Drawing World Map" , error);
        drawEmptyWorldMap();
      }
    }
  };
  drawOverworld();


  const handleResize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawOverworld();
  };
  window.addEventListener("resize" , handleResize);
  return () => {
    window.removeEventListener("resize" , handleResize);
  };
} , [maps , currentGameState ,customMapImage]);


const handleCanvasClick = (event) => {
  if(!maps.length || !currentGameState)
    return;

  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  console.log("Canvas Clicked at:" , mouseX , mouseY);

  // const clickedMap = getClickedMapNode(mouseX , mouseY , maps , canvas.width , canvas.height);

  // if(clickedMap) {
  //   if(clickedMap.chapter <= currentGameState.currentChapter) {
  //     setCurrentChapter(clickedMap.chapter);
  //     navigate("/unitSelect");
  //   } else {
  //     setLockedMessage(`Chapter ${clickedMap.chapter} is Locked`);
  //     setTimeout(() => setLockedMessage("") , 3000);
  //   }
  // }
};

// const handleChapterSelect = (chapter) => {
//   setCurrentChapter(chapter);
//   navigate("/unitSelect");
// };


if(loading) {
  console.log("Showing loading screen - loading:", loading);
  return <div className = "worldMapLoading"> Loading World Map </div>;
}


if(!currentGameState) {
  return(
    <div className = "worldMapLoading">
      <p> No Active Game Found. Load or Create a Save </p>
      <button onClick = {() => navigate("/saves")} className = "loadSaveButton"> Go to Saves </button>
    </div>
  );
}



  return (
    <div className = "worldMap">
      <h2> World Map </h2>

      {lockedMessage && (<div className = "lockedMessage"
          style = {{
            backgroundColor: "#ff6b6b" ,
            color: "white" ,
            padding: "10px" ,
            borderRadius: "5px" ,
            margin: "10px 0" ,
            textAlign: "center" ,
            fontWeight: "bold"
          }}>
            {lockedMessage} </div>)}

      <div className = "worldMapCont">
        <canvas ref = {canvasRef} width = {1000} height = {700}
          className = "worldMapCanvas" onClick = {handleCanvasClick}
          style = {{
            border: "2px solid #333" ,
            borderRadius: "8px" ,
            cursor: "pointer" ,
            maxWidth: "100%" ,
            height: "auto" ,
            backgroundColor: "#f0f0f0"
          }}
        />
      </div>
  

      <div className = "worldMapProgress">
        <p> Current Chapter: {currentGameState.currentChapter} </p>
        <p> Completed Chapters: {currentGameState.completedChapters.length} </p>

        <button onClick = {() => {
          if(currentSaveId && currentGameState) {
            saveGame(currentGameState)
            setLockedMessage("Saved");
            setTimeout(() => setLockedMessage("") , 3000);
          }
        }}
        className = "saveGameBtn"
        style = {{
          color: "white" ,
          padding: "10px 15px" ,
          borderRadius: "5px" ,
          border: "none" ,
          cursor: "pointer" ,
          margin: "10px 0"
        }}> Save Game </button>
      </div>
          
    </div>
  );
}

export default WorldMapPage;