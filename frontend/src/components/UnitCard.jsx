import UnitPortrait from "./UnitPortrait.jsx";

function UnitCard({unit , isSelected , onClick}) {
    return (
        <div className = {`unitCard ${isSelected ? "selected" : ""}`}
        onClick = {() => onClick(unit)}>



            <div className = "cardPortrait">
                <UnitPortrait unit = {unit} size = "medium"/>
            </div>

        <div className = "cardInfo">
            <h3> {unit.name} </h3>
            <p className = "unitClass"> {unit.class} </p>

            <div className = "cardStats">

                <div className = "stat">
                    <span className = "statLabel"> HP </span>
                    <span className = "statValue"> {unit.stats.hp} </span>
                </div>
           
                <div className = "stat">
                    <span className = "statLabel"> ATK </span>
                    <span className = "statValue"> {unit.stats.atk} </span>
                </div>
          
                <div className = "stat">
                    <span className = "statLabel"> DEF </span>
                    <span className = "statValue"> {unit.stats.def} </span>
                </div>
          
                <div className = "stat">
                    <span className = "statLabel"> SPD </span>
                    <span className = "statValue"> {unit.stats.spd} </span>
                </div>
            
                <div className = "stat">
                    <span className = "statLabel"> MOV </span>
                    <span className = "statValue"> {unit.stats.mov} </span>
                </div>
            </div>
        </div>

        {isSelected && (
            <div className = "unitSelected">
                <span></span>
            </div>
        )}

     </div>
    );
}

export default UnitCard;