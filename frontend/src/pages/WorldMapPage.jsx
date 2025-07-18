import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMaps } from "../services/api.js";


function WorldMapPage({setCurrentChapter , gameState}) {

  const [maps , setMaps] = useState([]);
  const [loading , setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaps = async () => {
try {
      const mapsData = await getMaps();
      setMaps(mapsData);
    } catch(error) {
      console.error("Failed to Get Maps:" , error);
    } finally {
      setLoading(false);
    }
  };

  fetchMaps();

} , []);


const handleChapterSelect = (chapter) => {
  setCurrentChapter(chapter);
  navigate("/unitSelect");
};


if(loading || !gameState) {
  return <div className = "worldMapLoading"> Loading World Map </div>;
}



  return (
    <div className = "worldMap">
      <h2> World Map </h2>
      <div className = "worldMapCont">
        {maps.map((map) => (
          <div key = {map._id} className = {`worldMapNode ${gameState.completedChapters.includes(map.chapter) ? "completed" : ""}
            ${map.chapter <= gameState.setCurrentChapter ? "available" : "locked"}`}
              onClick = {() => map.chapter <= gameState.setCurrentChapter && handleChapterSelect(map.chapter)}>

                <div className = "nodeInfo">
                  <h3> {map.name} </h3>
                  <p> Chapter {map.chapter} </p>
                  {map.description && (<p className = "chapterDescription"> {map.description} </p>)}
                </div>

                {gameState.completedChapters.includes(map.chapter) && (<div className = "completedIcon"> U+2713 </div>)}

                {map.chapter > gameState.setCurrentChapter && (<div className = "lockedIcon"> U+1F512 </div>)}
              
          </div>
          ))}
    </div>

    <div className = "worldMapProgress">
      <p> Current Chapter: {gameState.setCurrentChapter} </p>
      <p> Completed Chapters: {gameState.completedChapters.length} </p>
    </div>
    </div>
  );
}

export default WorldMapPage;