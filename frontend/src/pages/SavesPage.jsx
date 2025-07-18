import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSavesList , createNewSave , deleteSave , loadGame } from "../services/localStorage.js";
import SaveItem from "../components/SaveItem.jsx";


function SavesPage(currentSaveId , setCurrentSaveId) {

  const [saves , setSaves] = useState([]);
  const [newSaveName , setNewSaveName] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    loadSaves();
  } , []);

  const loadSaves = () => {
    const savesList = getSavesList();
    setSaves(savesList);
  };

  const handleLoadSave = (saveId) => {
    setCurrentSaveId(saveId);
    navigate("/worldMap");
  };

  
  const handleCreateNewSave = () => {
    const newSave = createNewSave(newSaveName || "player");
    setCurrentSaveId(newSave.id);
    navigate("/worldMap");
  };

  const handleDeleteSave = (saveId) => {
    deleteSave(saveId);
    loadSaves();

    if(currentSaveId === saveId) {
      setCurrentSaveId(null);
    }
  };



  return (
    <div className = "savesPage">
      <h2> Game Saves </h2>

      <div className = "newSave">
        <input type = "text" placeholder = "Enter Save Name" value = {newSaveName} onChange = {(event) => setNewSaveName(event.target.value)} className = "saveInput"/>
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
            />
          ))
        )}
  
      </div>
     
    </div>
  );
}

export default SavesPage;