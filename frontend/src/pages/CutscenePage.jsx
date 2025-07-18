import { useState , useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { getDialogue } from "../services/api.js";
import DialogueBox from "../components/DialogueBox.jsx";



function CutscenePage() {

  const {stageId , category}  = useParams();
  const [dialogue , setDialogue] = useState(null);
  const [currentScene , setCurrentScene] = useState(0);
  const [loading , setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDialogue = async () => {
try {
    const dialogueData = await getDialogue(stageId , category);
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

  const handleNext = () => {
    if(dialogue && currentScene < dialogue.scene.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      handleDialogueComplete();
    }
  };


  const handleDialogueComplete = () => {
    if(category === "intro") {
      navigate("/battle");
    } else {
      navigate("/worldMap");
    }
  };

  if(loading) {
    return <div className = "cutsceneLoading"> Loading </div>;
  }

  if(!dialogue) {
    return <div className = "cutsceneError"> Scene Not Found </div>;
  }


  return (

    <div className = "cutscenePage" onClick = {handleNext}>
        {dialogue.backgroundImage && (
          <div className = "cutsceneBackground" style = {{backgroundImage: `url(${dialogue.backgroundImage})`}}/>
        )}

        <DialogueBox dialogue={dialogue} currentIndex={currentScene} onNext = {handleNext}/>
      
      <div className = "sceneSkip"> Click to Continue / ESC to skip </div>
    </div>

  );
}

export default CutscenePage;