import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMapByChapter } from "../services/api.js";
import UnitCard from "../components/UnitCard.jsx";



function UnitSelectPage({gameState , selectedUnits , setSelectedUnits , currentChapter}) {
  
  const [availableUnits , setAvailableUnits] = useState([]);
  const [maxUnits , setMaxUnits] = useState(5);
  const [loading , setLoading] = useState(true);
  const [message , setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMapData = async () => {
  try {

      const mapData = await getMapByChapter(currentChapter);
      const unlockedUnits = mapData.allyUnits.filter(unit => gameState.unlockedUnits.includes(unit._id) || unit.isUnlocked);

          setAvailableUnits(unlockedUnits);
      } catch(error) {
        console.error("Failed to Get Map Data" , error);
      } finally {
        setLoading(false);
    }
  };

  if(currentChapter && gameState) {
    fetchMapData();
  }
} , [currentChapter , gameState]);


const toggleUnitSelection = (unit) => {
  if(selectedUnits.some(unit => unit._id === unit._id)) {
    setSelectedUnits(selectedUnits.filter(unit => unit._id !== unit._id));
  } else if(selectedUnits.length < maxUnits) {
    setSelectedUnits([...selectedUnits , unit]);
  }
};



const handleStartBattle = () => {
  if(selectedUnits.length >= 3) {
    navigate(`/cutscene/${currentChapter}/intro`);
  } else {
    setMessage("Select at Least 3 Units");
  }
};

const handleBack = () => {
  navigate("/worldMap");
};

if(loading) {
  return <div className = "unitSelectLoading"> Loading </div>;
}



  return (
    <div className = "unitSelectPage">
      <h2> Select Your Units </h2>
      <p className = "unitCounter"> Selected: {selectedUnits.length} / {maxUnits} </p>

      {message && <p className = "selectMessage"> {message} </p>}

      <div className = "selectGrid"> {availableUnits.map(unit => (
        <UnitCard key = {unit._id}
                  unit = {unit}
                  isSelected = {selectedUnits.some(unit => unit._id === unit._id)}
                  onClick = {toggleUnitSelection}/>))}
        </div>

        <div className = "selectPageActions">
          <button className = "selectPageBtn selectPageBtn--secondary"
          onClick = {handleBack}> Back </button>

          <button className = "selectPageBtn selectPageBtn--primary"
          onClick = {handleStartBattle} disabled = {selectedUnits.length < 3}> Start Battle </button>
        </div>
     
    </div>
  );
}

export default UnitSelectPage;