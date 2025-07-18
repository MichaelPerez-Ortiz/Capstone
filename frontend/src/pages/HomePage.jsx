import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSavesList } from "../services/localStorage";



function HomePage({setCurrentSaveId}) {

    const navigate = useNavigate();
    const [hasSaves , setHasSaves] = useState(false);

    useEffect(() => {
        const saves = getSavesList();
        setHasSaves(saves.length > 0);
    } , []);

    const handleNewGame = () => {
        navigate("/saves");
    };

    const handleContinue = () => {
        navigate("/saves");
    };


  return (
    <div className = "homePage">
        <div className = "title">
            <h1> Strategy RPG </h1>
        </div>

        <div className = "menu">
            <button className = "homePageButton homePageButton--primary" onClick = {handleNewGame}> New Game </button>
            {hasSaves && (
                <button className = "homePageButton" onClick = {handleContinue}> Continue </button>
            )}
        </div>
    </div>
  );
}

export default HomePage;