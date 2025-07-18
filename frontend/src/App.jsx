import { useState , useEffect } from 'react';
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
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

  const [currentSaveId , setCurrentSaveId] = useState(null);
  const [gameState , setGameState] = useState(null);
  const [selectedUnits , setSelectedUnits] = useState([]);
  const [currentChapter , setCurrentChapter] = useState(null);


    useEffect(() => {
      if(currentSaveId) {
        const savedState = loadGame(currentSaveId);

        if(savedState) {
          setGameState(savedState);
          setCurrentChapter(savedState.currentChapter);
        }
      } else {
        setGameState(null);
      }
    } , [currentSaveId]);


  return (
    <Router>
      <Navbar hasActiveSave={!!currentSaveId}/>
      <div className = "appContent">
        <Routes>

            <Route path = "/" element = {<HomePage setCurrentSaveId={setCurrentSaveId}/>}/>
            <Route path = "/battle" element = {<BattlePage selectedUnits={selectedUnits} 
                currentChapter={currentChapter}
                gameState={gameState}
                saveId={currentSaveId}
                setGameState={setGameState}/>}/>

            <Route path = "/unitSelect" element = {<UnitSelectPage selectedUnits = {selectedUnits}
                setSelectedUnits = {setSelectedUnits}
                currentChapter = {currentChapter}
                gameState = {gameState}/>}/>

            <Route path = "/worldMap" element = {<WorldMapPage setCurrentChapter = {setCurrentChapter} gameState = {gameState}/>}/>

            <Route path = "/cutscene/:stageId/:category" element = {<CutscenePage/>}/>

            <Route path = "/saves" element = {<SavesPage currentSaveId = {currentSaveId} setCurrentSaveId = {setCurrentSaveId}/>}/>

        </Routes>
      </div>
     
    </Router>
  );
}

export default App;
