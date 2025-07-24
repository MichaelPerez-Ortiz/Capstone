import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUnits } from "../services/api.js";
import UnitCard from "../components/UnitCard.jsx";



function UnitSelectPage({gameState , selectedUnits , setSelectedUnits , currentChapter}) {
  
  const [availableUnits , setAvailableUnits] = useState([]);
  const [maxUnits , setMaxUnits] = useState(5);
  const [loading , setLoading] = useState(true);
  const [message , setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
  try {

      const allUnits = await getUnits();
        console.log("Retrieved All Units" , allUnits);

        const unlockedAllies = allUnits.filter(unit => {

          const isAlly = unit.loyalty === "ally";
          const isUnlocked = unit.isUnlocked === true || 
          (gameState?.unlockedUnits && gameState.unlockedUnits.includes(unit._id));

          return isAlly && isUnlocked;
        });

        const sortedUnits = unlockedAllies.sort((a , b) => {
          if(a.name === "Kirsa") return -1;
          if(b.name === "Kirsa") return 1;
          return 0;
        });
        setAvailableUnits(unlockedAllies);

      } catch(error) {
        console.error("Failed to Get Units" , error);
      } finally {
        setLoading(false);
    }
   };
   fetchUnits();

  } , [gameState]);

  useEffect(() => {
    if(availableUnits.length > 0) {
      const kirsa = availableUnits.find(unit => unit.name === "Kirsa");

      if(kirsa && !selectedUnits.some(unit => unit.name === "Kirsa")) {
        setSelectedUnits([kirsa , ...selectedUnits]);
      }
    }
  } , [availableUnits , selectedUnits , setSelectedUnits]);


const toggleUnitSelection = (unit) => {
  if(unit.name === "Kirsa") {
    return;
  }
  if(selectedUnits.some(selectedUnit => selectedUnit._id === unit._id)) {
    setSelectedUnits(selectedUnits.filter(selectedUnit => selectedUnit._id !== unit._id));
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
        <div key = {unit._id} className = {unit.name === "Kirsa" ? "required" : ""}>
        <UnitCard key = {unit._id}
                  unit = {unit}
                  isSelected = {unit.name === "Kirsa" || selectedUnits.some(selectedUnit => selectedUnit._id === unit._id)}
                  onClick = {() => toggleUnitSelection(unit)}/>
                  
                  {unit.name === "Kirsa" && <div className = "requiredTip"> Unit Required </div>}
               </div>))}
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