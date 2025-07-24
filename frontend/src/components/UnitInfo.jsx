

function UnitInfo({unit , onAction}) {
    if(!unit)
        return null;

    const handleAction = (action) => {
        onAction(action , unit);
    };

    return(

        <div className = "unitInfo">
          <div className = "unitHeader">
            <h3> {unit.name} </h3>
            <p> {unit.class} </p>
          </div>


            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> HP </span>
                    <span className = "statValue"> {unit.stats.hp} </span>
                </div>
            </div>
            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> ATK </span>
                    <span className = "statValue"> {unit.stats.atk} </span>
                </div>
            </div>
            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> DEF </span>
                    <span className = "statValue"> {unit.stats.def} </span>
                </div>
            </div>
            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> SPD </span>
                    <span className = "statValue"> {unit.stats.spd} </span>
                </div>
            </div>
            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> MOV </span>
                    <span className = "statValue"> {unit.stats.mov} </span>
                </div>
            </div>
            

            <div className = "unitActions">
                <button onClick = {() => handleAction("move")}> Move </button>
                <button onClick = {() => handleAction("attack")}> Attack </button>
                <button onClick = {() => handleAction("wait")}> Wait </button>
            </div>
        </div>
    );
}

export default UnitInfo;