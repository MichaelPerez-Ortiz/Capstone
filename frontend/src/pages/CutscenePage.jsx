import { useState , useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { getDialogue } from "../services/api.js";
import DialogueBox from "../components/DialogueBox.jsx";



function CutscenePage({setCurrentChapter}) {

  const {stageId , category}  = useParams();
  const [dialogue , setDialogue] = useState(null);
  const [currentScene , setCurrentScene] = useState(0);
  const [loading , setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDialogue = async () => {
try {
    const dialogueData = await getDialogue(stageId , category);

    const loadedDialogue = {
      ...dialogueData , 
      scene: dialogueData.scene.map(scene => ({
        ...scene ,
        portrait: scene.speaker === "narrator" ? "" : scene.portrait
      }))
    };


    setDialogue(dialogueData);
    } catch(error) {
      console.error("Failed to Get Dialogue" , error);

      if(error.response && error.response.status === 404) {
        handleDialogueComplete();
      }
    } finally {
      setLoading(false);
    }
  };

  fetchDialogue();

  } , [stageId , category]);


  useEffect(() => {
    const handleKeyPress = (event) => {
      if(event.key === "Tab") {
        event.preventDefault();
        handleDialogueComplete();
      }
    };
    window.addEventListener("keydown" , handleKeyPress);
    return () => {
      window.removeEventListener("keydown" , handleKeyPress);
    };
  } , []);


  const handleNext = () => {
    if(dialogue && currentScene < dialogue.scene.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      handleDialogueComplete();
    }
  };


  const handleDialogueComplete = () => {
    if(category === "intro") {
      if(parseInt(stageId) === 0) {
        setCurrentChapter(1);
        navigate("/cutscene/1/intro");
        return;
      }
      navigate("/battle");
    } else {
      navigate("/worldMap");
    }
  };

  const getBackgroundStyle = () => {
    if(!dialogue.backgroundImage)
      return{};

    if(dialogue.backgroundImage.includes("gradient")) {
      return {background: dialogue.backgroundImage};
    } else {
      return {backgroundImage: `url(${dialogue.backgroundImage})`};
    }
  };



  if(loading) {
    return <div className = "cutsceneLoading"> Loading </div>;
  }

  if(!dialogue) {
    return <div className = "cutsceneError"> Scene Not Found </div>;
  }


  return (

    <div className = "cutscenePage" data-stage = {stageId} onClick = {handleNext}>
        {dialogue.backgroundImage && (
          <div className = "cutsceneBackground" style = {getBackgroundStyle()}/>
        )}

        <DialogueBox dialogue={dialogue} currentIndex={currentScene} onNext = {handleNext}/>
      
      <div className = "sceneSkip"> Click to Continue / TAB to skip </div>
    </div>

  );
}

export default CutscenePage;