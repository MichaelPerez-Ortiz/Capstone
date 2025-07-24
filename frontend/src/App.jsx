import { useState , useEffect } from 'react';
import { BrowserRouter as Router , Routes , Route , Navigate} from 'react-router-dom';
import { loadGame } from './services/localStorage.js';
import HomePage from './pages/HomePage.jsx';
import BattlePage from './pages/BattlePage.jsx';
import UnitSelectPage from './pages/UnitSelectPage.jsx';
import WorldMapPage from './pages/WorldMapPage.jsx';
import CutscenePage from './pages/CutscenePage.jsx';
import SavesPage from './pages/SavesPage.jsx';
import Navbar from './components/Navbar.jsx';


import './App.css'


function App() {

  // const [currentSaveIdState , setCurrentSaveIdState] = useState(() => {
  //   return localStorage.getItem("currentSaveId") || null;});

const [currentSaveIdState , setCurrentSaveIdState] = useState(() => {
  const saveId = localStorage.getItem("currentSaveId");
  console.log("App.jsx - localStorage currentSaveId:" , saveId);
  return saveId || null;
});

  const [gameState , setGameState] = useState(null);
  const [selectedUnits , setSelectedUnits] = useState([]);
  const [currentChapter , setCurrentChapter] = useState(null);

  const setCurrentSaveId = (saveId) => {
      console.log("App.jsx - Setting currentSaveId in localStorage:", saveId);
    setCurrentSaveIdState(saveId);

    if(saveId) {
      localStorage.setItem("currentSaveId" , saveId);
    } else {
      localStorage.removeItem("currentSaveId");
    }
  };


    useEffect(() => {
      if(currentSaveIdState) {
        const savedState = loadGame(currentSaveIdState);
       
        if(savedState) {
          setGameState(savedState);
          setCurrentChapter(savedState.currentChapter);
        }
      } else {
        setGameState(null);
      }
    } , [currentSaveIdState]);

     console.log("App.jsx - currentSaveIdState:", currentSaveIdState);

  return (
    <Router>
      <Navbar hasActiveSave={!!currentSaveIdState}/>
      <div className = "appContent">
        <Routes>

            <Route path = "/" element = {<HomePage setCurrentSaveId={setCurrentSaveId}/>}/>
            <Route path = "/battle" element = {<BattlePage selectedUnits={selectedUnits} 
                currentChapter={currentChapter}
                gameState={gameState}
                saveId={currentSaveIdState}
                setGameState={setGameState}/>}/>

            <Route path = "/unitSelect" element = {<UnitSelectPage selectedUnits = {selectedUnits}
                setSelectedUnits = {setSelectedUnits}
                currentChapter = {currentChapter}
                gameState = {gameState}/>}/>

            <Route path = "/worldMap" element = {<WorldMapPage setCurrentChapter = {setCurrentChapter} gameState = {gameState} currentSaveId = {currentSaveIdState}/>}/>

            <Route path = "/cutscene/:stageId/:category" element = {<CutscenePage setCurrentChapter = {setCurrentChapter}/>}/>

            <Route path = "/saves" element = {<SavesPage currentSaveId = {currentSaveIdState} setCurrentSaveId = {setCurrentSaveId}/>}/>

        </Routes>
      </div>
     
    </Router>
  );
}

export default App;
