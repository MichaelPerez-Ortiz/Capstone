import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSavesList , createNewSave , deleteSave , loadGame , saveGame } from "../services/localStorage.js";
import SaveItem from "../components/SaveItem.jsx";


function SavesPage({currentSaveId , setCurrentSaveId}) {

  const [saves , setSaves] = useState([]);
  const [newSaveName , setNewSaveName] = useState("");
  const [saveMessage , setSaveMessage] = useState("")
  const navigate = useNavigate();


  useEffect(() => {
    loadSaves();
  } , []);

  const loadSaves = () => {
    const savesList = getSavesList();
    setSaves(savesList);
  };

  const handleLoadSave = (saveId) => {
    console.log("SavesPage - Setting currentSaveId:", saveId);
    setCurrentSaveId(saveId);
    navigate("/worldMap");
  };

  
  const handleCreateNewSave = () => {
    const newSave = createNewSave(newSaveName || "player");
    setCurrentSaveId(newSave.id);
    navigate("/cutscene/0/intro");
  };

  const handleSaveGame = (saveId) => {
    const currentGame = loadGame(saveId);
    if(currentGame) {
      saveGame(currentGame);
      setSaveMessage("Saved");
      setTimeout(() => setSaveMessage("") , 3000);
      loadSaves();
    } else {
      setSaveMessage("Failed to Save");
      setTimeout(() => setTimeout("") , 3000);
    }
  };

  const handleDeleteSave = (saveId) => {
    deleteSave(saveId);
    loadSaves();

    if(currentSaveId === saveId) {
      setCurrentSaveId(null);
    }
  };

  const handleKeyDown = (event) => {
    if(event.key === "Enter") {
      handleCreateNewSave();
    }
  };



  return (
    <div className = "savesPage">
      <h2> Game Saves </h2>

      {saveMessage && (<div className = "saveMessage"
          style = {{
            backgroundColor: saveMessage.includes("success") ? "#4CAF50" : "#f44336" ,
            color: "white" ,
            padding: "10px" ,
            borderRadius: "5px" ,
            margin: "10px 0" ,
            textAlignlign: "center" ,
            fontWeight: "bold"
          }}> {saveMessage} </div>
        
        )}

      <div className = "newSave">
        <input type = "text" placeholder = "Enter Save Name" value = {newSaveName} onChange = {(event) => setNewSaveName(event.target.value)}
        onKeyDown = {handleKeyDown}  className = "saveInput"/>
        <button onClick = {handleCreateNewSave} className = "saveButton"> Create New Save </button>
      </div>

      <div className = "savesList">
        {saves.length === 0 ? (
          <p className = "emptyList"> No Saves Found. Create a New Save </p>
        ) : (
          saves.map(save => (
            <SaveItem
            key = {save.id}
            save = {save}
            isActive={currentSaveId === save.id}
            onLoad={handleLoadSave}
            onDelete={handleDeleteSave}
            onSave={handleSaveGame}
            />
          ))
        )}
  
      </div>
     
    </div>
  );
}

export default SavesPage;