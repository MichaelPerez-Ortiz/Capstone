

function UnitPortrait({unit , size = "medium" , onCLick}) {
    if(!unit || !unit.unitPortrait) {
        return (
            <div className = {`unitPortrait unitPortrait--${size} unitPortrait--placeholder`}
            onClick = {onCLick}>

                <div className = "portraitPlaceholder">
                    {unit?.name?.charAT(0) || "?"}
                </div>
            </div>
        );
    }

    return (
        <div className = {`unitPortrait unitPortrait--${size}`}
        conClick = {onCLick}>
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