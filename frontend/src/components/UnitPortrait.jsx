

function UnitPortrait({unit , size = "medium" , onCLick , shouldFlip = false}) {
    if(!unit || !unit.portrait) {
        return (
            <div className = {`unitPortrait unitPortrait--${size} unitPortrait--placeholder ${shouldFlip ? "unitPortrait--flipped" : ""}`}
            onClick = {onCLick}>

                <div className = "portraitPlaceholder">
                    {unit?.name?.charAt(0) || "?"}
                </div>
            </div>
        );
    }

    return (
        <div className = {`unitPortrait unitPortrait--${size} ${shouldFlip ? "unitPortrait--flipped" : ""}`}
        onClick = {onCLick}>
            <img src = {unit.portrait} alt = {unit.name} className = "portraitImage"/>
            {size !== "small" && (
                <div className = "portraitName">
                    {unit.name}
                 </div>
            )}
        </div>

    );
}

export default UnitPortrait;