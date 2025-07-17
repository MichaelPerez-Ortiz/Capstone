import UnitPortrait from "./UnitPortrait.jsx";

function DialogueBox({dialogue , currentIndex , next}) {
    if(!dialogue || !dialogue.scene || dialogue.scene.length === 0) {
        return null;
    }

    const currentScene = dialogue.scene[currentIndex];
    const isLeftSpeaker = currentScene.position === "left";

    return (

     <div className = "dialogueBox" onClick={next}>
            <div className = {`dialoguePortrait dialoguePortrait--${currentScene.position}`}>
                <UnitPortrait unit = {currentScene.speakerId} size = "large"/>
            </div>
    

        <div className = "dialogueContent">

            <div className = "dialogueSpeaker"> {currentScene.speaker} </div>
            <div className = "dialogueText"> {currentScene.text} </div>
            <div className = "dialogueCont"> Click to Continue </div>
        </div>
    </div>
    
    );
}

export default DialogueBox;